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

const ensureInstallConfig = ({ timeout, retries }: InstallConfig = {}) => ({
  timeout: timeout || 60000,
  retries: retries || 1,
})

const pickIfSet = (upstream, config) => {
  const isObject = checkIsObject(upstream)
  if (!isObject) {
    return config
  }

  const { library, alias, format, exportsOnly } = config

  return {
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
  private readonly _linked: Linked
  private readonly _resolvedModules: Caches<string, LoadResults<any>>
  private readonly _pingResources: Caches<
    string,
    { script: Element; styles: Element[] }
  >

  constructor() {
    if (!checkIsInitialized()) {
      throw new Error('Modules was not call bootstrap before used')
    }

    this._config = getConfig()
    this._platform = getRuntimePlatform()
    this._globals = new Globals(this._platform)

    // Init resolved cache and ping resources
    this._resolvedModules = new Caches()
    this._pingResources = new Caches()

    // Create linked
    this._linked = new Linked(this._config.getLinked())
  }

  private getKey(item: BaseItemConfig) {
    return item.isExternal
      ? 'e:' + hasher.moduleId(item)
      : 'm:' + (item as ModuleItemConfig).name
  }

  private async canUseLocal(item: BaseItemConfig) {
    const { name, local, preferLocal } = item

    if (!preferLocal) {
      return false
    }

    return !!(
      local ||
      requireHelpers.local(name, this._globals) ||
      (await this._linked.isOk(name))
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

    const canUseLocal = await this.canUseLocal(item)
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

  private async runScript(
    { code, format, library, alias, exportsOnly },
    {
      upstream = false,
      linked = false,
    }: Partial<{ upstream: boolean; linked: boolean }>,
  ) {
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
      upstream,
      linked,
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

    const { upstream } = item
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

    const exportsModule = await this.runScript(
      {
        code: moduleScript,
        format,
        library,
        alias,
        exportsOnly,
      },
      {
        upstream: true,
      },
    )

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
    const isNode = this._platform === RuntimePlatforms.node

    const { upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)

    const { styles } = requireHelpers.parse(upstream, this._platform)

    const moduleScript = await this._linked.getScript(item.name)

    const exportsModule = await this.runScript(
      {
        code: moduleScript,
        format,
        library,
        alias,
        exportsOnly,
      },
      {
        linked: true,
      },
    )

    const moduleStyles = isNode
      ? []
      : styles.map(style =>
          DOMHelpers.loadStyle(style.url, { integrity: style.integrity }),
        )

    this._linked.watch([item.name])

    return {
      module: exportsModule,
      styles: moduleStyles,
    }
  }

  private async resolveInLocal(item: BaseItemConfig, options?: InstallConfig) {
    const { name, local, preferLocal, alias, exportsOnly } = item

    if (preferLocal) {
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

    return null
  }

  private async resolve(item: BaseItemConfig, options?: InstallConfig) {
    const resolveInLocal = await this.resolveInLocal(item, options)
    if (resolveInLocal) {
      return resolveInLocal
    }

    try {
      const resolvedLinked = await this.resolveInLinked(item, options)
      return resolvedLinked
    } catch (error) {}

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

  async prepare() {
    this.bindVendors()
  }

  async preload(names: string[]) {
    const modules = this._config.getModules()

    const matches = names.map(name => modules[name]).filter(Boolean)
    return matches.map(match => this.ping(match))
  }

  async requireByName<T = unknown>(name: string): Promise<T> {
    const resolved = await this.loadByName<T>(name)
    return resolved.module
  }

  async loadByName<M = unknown>(name: string): Promise<LoadResults<M>> {
    const modules = this._config.getModules()

    const item = modules[name]
    if (!item) {
      throw new Error(`Cannot load module by name: ${name}.`)
    }

    const resolved = await this.load<M>(item)
    return resolved
  }
}

export default Modules
