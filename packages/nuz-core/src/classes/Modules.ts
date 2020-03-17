import { checkIsObject, jsonHelpers } from '@nuz/utils'

import {
  BaseItemConfig,
  InstallConfig,
  ModuleItemConfig,
  RuntimePlatforms,
} from '../types'

import checkIsFunction from '../utils/checkIsFunction'
import checkIsInitialized from '../utils/checkIsInitialized'
import * as DOMHelpers from '../utils/DOMHelpers'
import getConfig, { Config } from '../utils/effects/getConfig'
import getRuntimePlatform from '../utils/getRuntimePlatform'
import getScript from '../utils/getScript'
import * as hasher from '../utils/hasher'
import interopRequireDefault from '../utils/interopRequireDefault'
import * as moduleHelpers from '../utils/moduleHelpers'
import * as requireHelpers from '../utils/requireHelpers'

import Caches from './Caches'
import Globals from './Globals'
import Linked from './Linked'
import Script from './Script'

const getUrlOrigin = (url: string) => new URL(url).origin

const ensureInstallConfig = ({
  timeout,
  retries,
  ...rest
}: InstallConfig = {}) => ({
  ...rest,
  timeout: timeout || 60000,
  retries: retries || 1,
})

const pickIfSet = (upstream, config) => {
  const isObject = checkIsObject(upstream)
  if (!isObject) {
    return config
  }

  const { library, alias, format, exportsOnly, ...rest } = config

  return {
    ...rest,
    library: upstream.library || library,
    alias: upstream.alias || alias,
    format: upstream.format || format,
    exportsOnly: upstream.exportsOnly || exportsOnly,
  }
}

export interface LoadResults<M = unknown> {
  module: M
  styles: Element[]
}

class Modules {
  private readonly _config: Config
  private readonly _platform: RuntimePlatforms
  private readonly _globals: Globals
  private readonly _dev: boolean
  private readonly _resolvedModules: Caches<string, LoadResults<any>>
  private readonly _pingResources: Caches<
    string,
    { script: Element; styles: Element[] }
  >

  private _linked: Linked

  constructor() {
    if (!checkIsInitialized()) {
      throw new Error('Modules was not call bootstrap before used')
    }

    this._config = getConfig()
    this._platform = getRuntimePlatform()
    this._globals = new Globals(this._platform)

    // Set is development mode
    this._dev = this._config.isDev()

    // Init resolved cache and ping resources
    this._resolvedModules = new Caches()
    this._pingResources = new Caches()
  }

  private async linkModules() {
    // Create linked instance with bootstrap config
    this._linked = new Linked(this._config.getLinked())

    // Prepare: wait socket ready, binding events,...
    await this._linked.prepare()

    return true
  }

  private getAllModules() {
    const definedModules = Object.assign({}, this._config.getModules())

    // In development mode, extends modules config with linked modules
    if (this._dev) {
      const linkedModules = this._linked.getModules()
      Object.assign(definedModules, this._config.defineModules(linkedModules))
    }

    return definedModules
  }

  private getKey(item: BaseItemConfig) {
    return item.isExternal
      ? 'e:' + hasher.moduleId(item)
      : 'm:' + (item as ModuleItemConfig).name
  }

  private async canUseLocal(item: BaseItemConfig) {
    const { name, local } = item

    return !!(
      local ||
      requireHelpers.local(name, this._globals) ||
      (await this._linked.exists(name))
    )
  }

  private createContext() {
    return Object.create(this._globals.get())
  }

  private bindVendors() {
    const vendors = this._config.getVendors()

    const keys = Object.keys(vendors)
    for (const key of keys) {
      const vendor = interopRequireDefault(vendors[key])
      const exportsModule = moduleHelpers.define(vendor, {
        module: true,
        vendor: true,
      })
      this._globals.set(key, exportsModule)
    }
  }

  private async ping(item: BaseItemConfig) {
    const isNode = this._platform === RuntimePlatforms.node
    if (isNode) {
      return false
    }

    const canUseLocal = this._dev && (await this.canUseLocal(item))
    if (canUseLocal) {
      return false
    }

    const key = this.getKey(item)
    const called =
      this._pingResources.has(key) || this._resolvedModules.has(key)
    if (called) {
      return true
    }

    const { upstream } = item

    const resolveUrls = requireHelpers.parse(upstream, this._platform)
    const preloadScript = DOMHelpers.preloadScript(resolveUrls.main.url, {
      integrity: resolveUrls.main.integrity,
    })
    const preloadStyles = resolveUrls.styles.map(style =>
      DOMHelpers.preloadStyle(style.url, {
        integrity: style.integrity,
      }),
    )

    this._pingResources.set(key, {
      script: preloadScript,
      styles: preloadStyles,
    })

    return true
  }

  private async runScript({ code, format, library, alias, exportsOnly }) {
    const isNode = this._platform === RuntimePlatforms.node
    const context = this.createContext()

    try {
      const script = new Script(code, {
        format,
      })

      if (isNode) {
        await script.runInContext(context)
      } else {
        await script.runInScript(context)
      }
    } catch (error) {
      console.error(
        `Module installed uncaught error: ${error.message || error}`,
      )
      throw error
    }

    const moduleInContext = library ? context[library] : context

    let exportsModule = Object.assign(
      {},
      interopRequireDefault(moduleInContext),
      moduleInContext,
    )
    exportsModule = moduleHelpers.transform(exportsModule, {
      alias,
      exportsOnly,
    })
    exportsModule = moduleHelpers.define(exportsModule, {
      module: true,
      upstream: true,
    })

    if (!checkIsFunction(exportsModule.default)) {
      throw new Error('Module is not exported!')
    }

    return exportsModule
  }

  private async resolveOnUpstream(
    item: BaseItemConfig,
    options?: InstallConfig,
  ) {
    const isNode = this._platform === RuntimePlatforms.node

    const { name, upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)
    const { timeout, retries } = ensureInstallConfig(options)

    const { main, styles } = requireHelpers.parse(upstream, this._platform)

    const moduleScript = await getScript(
      main.url,
      {
        timeout,
        integrity: main.integrity,
      },
      retries,
    )

    const exportsModule = await this.runScript({
      code: moduleScript,
      format,
      library,
      alias,
      exportsOnly,
    })

    const moduleStyles = isNode
      ? []
      : styles.map(style =>
          DOMHelpers.loadStyle(style.url, { integrity: style.integrity }),
        )

    return {
      module: exportsModule,
      styles: moduleStyles,
    }
  }

  private async resolveInLinked(item: BaseItemConfig, options?: InstallConfig) {
    if (!this._linked.exists(item.name)) {
      return null
    }

    const resolved = await this.resolveOnUpstream(item, options)

    moduleHelpers.define(resolved.module, {
      linked: true,
    })

    //  Watch and reload if module was changed
    this._linked.watch([item.name])

    return resolved
  }

  private async resolveInLocal(item: BaseItemConfig, options?: InstallConfig) {
    const { name, local, alias, exportsOnly } = item

    const resolvedInLocal = local || requireHelpers.local(name, this._globals)
    if (!resolvedInLocal) {
      return null
    }

    let exportsModule = Object.assign(
      {},
      interopRequireDefault(resolvedInLocal),
    )
    exportsModule = moduleHelpers.transform(exportsModule, {
      alias,
      exportsOnly,
    })
    exportsModule = moduleHelpers.define(exportsModule, {
      module: true,
      local: true,
    })

    return {
      module: exportsModule,
      styles: [],
    }
  }

  private async resolve(item: BaseItemConfig, options?: InstallConfig) {
    // In development mode, allowed to resolve in local and linked
    if (this._dev) {
      const resolveInLocal = await this.resolveInLocal(item, options)
      if (resolveInLocal) {
        return resolveInLocal
      }

      const resolveInlinked = await this.resolveInLinked(item, options)
      if (resolveInlinked) {
        return resolveInlinked
      }
    }

    try {
      const resolvedOnUpstream = await this.resolveOnUpstream(item, options)
      return resolvedOnUpstream
    } catch (error) {
      console.error(
        `Cannot load or execute module on upstream: ${error.message || error}`,
      )

      const fallbackIsExisted = !!item.fallback
      if (!fallbackIsExisted) {
        throw error
      }

      const cloned = { ...item, upstream: item.fallback, fallback: undefined }
      console.log(
        `Try to use fallback as backup module: ${jsonHelpers.stringify(
          cloned,
        )}`,
      )

      const resolvedOfFallback = await this.resolveOnUpstream(cloned, options)
      return resolvedOfFallback
    }
  }

  private async load<M = unknown>(
    item: BaseItemConfig,
    options?: InstallConfig,
  ): Promise<LoadResults<M>> {
    const { name } = item

    if (!name) {
      throw new Error('Not found name in item config')
    }

    const resolvedCache = this._resolvedModules

    const key = this.getKey(item)
    if (resolvedCache.has(key)) {
      return resolvedCache.get(key)
    }

    const resolvedModule = await this.resolve(item, options)
    resolvedCache.set(key, resolvedModule)

    return resolvedModule
  }

  private optimizeConnection() {
    const modules = this.getAllModules()
    const modulesKeys = Object.keys(modules)

    const urls = modulesKeys.reduce((acc, key) => {
      const item = modules[key]

      const { main, styles } = requireHelpers.parse(
        item.upstream,
        this._platform,
      )

      return acc.concat(
        getUrlOrigin(main.url),
        ...styles.map(style => getUrlOrigin(style.url)),
      )
    }, [])

    const deduplicated = Array.from(new Set(urls))
    const dnsPrefetchs = deduplicated.map(item => DOMHelpers.dnsPrefetch(item))
    return dnsPrefetchs
  }

  async prepare() {
    this.bindVendors()

    if (this._dev) {
      // Call to check and use linked modules if availability
      await this.linkModules()
    }

    // Check and prepare connections for resources
    this.optimizeConnection()

    // Preload resources
    await this.preload()
  }

  async preload() {
    const modules = this.getAllModules()
    const preload = this._config.getPreload()

    const pings: Promise<boolean>[] = []
    for (const name of preload) {
      const item = modules[name]
      if (item) {
        pings.push(this.ping(item))
      }
    }

    return pings
  }

  async requireByName<T = unknown>(name: string): Promise<T> {
    const resolved = await this.loadByName<T>(name)
    return resolved.module
  }

  async loadByName<M = unknown>(name: string): Promise<LoadResults<M>> {
    const modules = this.getAllModules()

    const item = modules[name]
    if (!item) {
      throw new Error(`Cannot load module by name: ${name}.`)
    }

    const resolved = await this.load<M>(item)
    return resolved
  }
}

export default Modules
