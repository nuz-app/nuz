import {
  checkIsObject,
  deferedPromise,
  DeferedPromise,
  jsonHelpers,
} from '@nuz/utils'

import {
  BaseItemConfig,
  InstallConfig,
  ModuleFormats,
  RuntimePlatforms,
} from '../types'

import checkIsFunction from '../utils/checkIsFunction'
import checkIsInitialized from '../utils/checkIsInitialized'
import * as DOMHelpers from '../utils/DOMHelpers'
import getConfig, { Config } from '../utils/effects/getConfig'
import getRuntimePlatform from '../utils/getRuntimePlatform'
import getScript from '../utils/getScript'
import interopRequireDefault from '../utils/interopRequireDefault'
import * as moduleHelpers from '../utils/moduleHelpers'
import * as requireHelpers from '../utils/requireHelpers'

import Caches from './Caches'
import Globals from './Globals'
import Linked from './Linked'
import Script from './Script'

export type RequiredBaseItem = BaseItemConfig &
  Required<
    Pick<
      BaseItemConfig,
      'name' | 'local' | 'alias' | 'exportsOnly' | 'upstream'
    >
  >

const getUrlOrigin = (url: string) => {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

const ensureInstallConfig = ({
  timeout,
  retries,
  ...rest
}: InstallConfig = {}) => ({
  ...rest,
  timeout: timeout || 60000,
  retries: retries || 1,
})

const pickIfSet = (upstream: any, config: RequiredBaseItem) => {
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

const PRECONNECT_LIMIT_DOMAIN = 3

let wsWarningIsShowed = false

type TagElement = DOMHelpers.DefinedElement

export interface LoadResults<M = unknown> {
  module: M
  styles: TagElement[]
}

class Modules {
  private readonly _readyPromise: DeferedPromise<boolean>
  private readonly _config: Config
  private readonly _platform: RuntimePlatforms
  private readonly _globals: Globals
  private readonly _dev: boolean
  private readonly _ssr: boolean
  private readonly _resolvedModules: Caches<string, LoadResults<any>>
  private readonly _resolvedDependencies: Caches<string, any>
  private readonly _pingResources: Caches<
    string,
    { script: TagElement; styles: TagElement[] }
  >
  private readonly _dnsPrefetchs: Set<TagElement>
  // @ts-ignore
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

    // Init maps for resolved modules, shared and ping resources
    this._resolvedDependencies = new Caches()
    this._resolvedModules = new Caches()
    this._pingResources = new Caches()
    this._dnsPrefetchs = new Set()

    // Create defered promise to checking ready
    this._readyPromise = deferedPromise<boolean>()

    // Check SSR mode is valid
    const isNode = this._platform === RuntimePlatforms.node
    const isUseSSR = this._config.isSSR()
    this._ssr = isUseSSR && isNode

    if (!isUseSSR && isNode) {
      throw new Error(`Can't run in Node environment if not enable SSR mode!`)
    }
  }

  private async linkModules() {
    // Create linked instance with bootstrap config
    const config = this._config.getLinked()
    this._linked = new Linked(config)

    if (!wsWarningIsShowed && config.port) {
      wsWarningIsShowed = true

      console.warn(
        `Please make sure the workspace server was started! \n Start workspace by command: \n > nuz workspace --port ${config.port}`,
      )
    }

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

  private getKey(item: RequiredBaseItem): string {
    return (item && item.name) as string
  }

  private async canUseLocal(item: RequiredBaseItem) {
    const { name, local } = item

    return !!(
      local ||
      requireHelpers.local(name, this._globals) ||
      (await this._linked.exists(name))
    )
  }

  private createContext() {
    return Object.create(this._globals.getContext())
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
      this._globals.setDependency(key, exportsModule)
    }
  }

  private async ping(item: RequiredBaseItem) {
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

    const resolveUrls = requireHelpers.parse(upstream, this._platform) || {}
    const { main, styles } = resolveUrls || ({} as any)

    const preloadScript = DOMHelpers.preloadScript(main.url, {
      integrity: main.integrity,
    })
    const preloadStyles = styles.map((style: any) =>
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

  private async loadDependency(name: string) {
    if (this._resolvedDependencies.has(name)) {
      return this._resolvedDependencies.get(name)
    }

    const sharedDependencies = this._config.getShared()
    const dependencyFactory = sharedDependencies[name]
    if (!dependencyFactory) {
      throw new Error(`Can not found shared dependency by name ${name}`)
    }

    if (!checkIsFunction(dependencyFactory)) {
      throw new Error(`Dependency factory of ${name} is invalid`)
    }

    const resolvedDependency = await Promise.resolve(dependencyFactory())

    const exportsModule = moduleHelpers.define(resolvedDependency, {
      module: true,
      shared: true,
    })
    this._globals.setDependency(name, exportsModule)

    this._resolvedDependencies.set(name, exportsModule)
    return resolvedDependency
  }

  private async loadDependencies(shared: string[]) {
    return shared.map((item) => this.loadDependency(item))
  }

  private async runScript({
    code,
    format,
    library,
    alias,
    exportsOnly,
  }: BaseItemConfig & { format: ModuleFormats; code: string }) {
    const context = this.createContext()

    try {
      const script = new Script(code, {
        format,
      })

      if (this._ssr) {
        await script.runInContext(context)
      } else {
        await script.runInScript(context)
      }
    } catch (error) {
      console.error(`Module installed uncaught error, details:`, error)
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
    item: RequiredBaseItem,
    options?: InstallConfig,
  ) {
    const { upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)
    const { timeout, retries } = ensureInstallConfig(options)

    const { main, styles } =
      requireHelpers.parse(upstream, this._platform) || {}

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

    const moduleStyles = (styles || []).map((style) =>
      DOMHelpers.loadStyle(style.url, { integrity: style.integrity }),
    )

    return {
      module: exportsModule,
      styles: moduleStyles,
    }
  }

  private async resolveInLinked(
    item: RequiredBaseItem,
    options?: InstallConfig,
  ) {
    if (!this._linked.exists(item.name)) {
      return null
    }

    const resolved = await this.resolveOnUpstream(item, options)

    moduleHelpers.define(resolved.module, {
      linked: true,
    })

    //  Watch and reload if module was changed, only client-side
    if (!this._ssr) {
      this._linked.watch([item.name])
    }

    return resolved
  }

  private async resolveInLocal(
    item: Required<
      Pick<BaseItemConfig, 'name' | 'local' | 'alias' | 'exportsOnly'>
    >,
    options?: InstallConfig,
  ) {
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

  private async resolve(item: RequiredBaseItem, options?: InstallConfig) {
    await this.loadDependencies((item as any).shared)

    // In development mode, allowed to resolve in local and linked
    if (this._dev) {
      const resolvedInLocal = await this.resolveInLocal(item, options)
      if (resolvedInLocal) {
        return resolvedInLocal
      }

      const resolvedInlinked = await this.resolveInLinked(item, options)
      if (resolvedInlinked) {
        return resolvedInlinked
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

      const cloned = {
        ...item,
        upstream: item.fallback,
        fallback: undefined,
      } as RequiredBaseItem
      console.warn(
        `Try to use fallback as backup module: ${jsonHelpers.stringify(
          cloned,
        )}`,
      )

      const resolvedOfFallback = await this.resolveOnUpstream(cloned, options)
      return resolvedOfFallback
    }
  }

  private async load<M = unknown>(
    item: RequiredBaseItem,
    options?: InstallConfig,
  ): Promise<LoadResults<M>> {
    const { name } = item

    if (!name) {
      throw new Error('Not found name in item config')
    }

    const resolvedCache = this._resolvedModules

    const key = this.getKey(item)
    // if (resolvedCache.has(key)) {
    //   return resolvedCache.get(key) as any
    // }

    const resolvedModule = await this.resolve(item, options)
    resolvedCache.set(key, resolvedModule)

    return resolvedModule
  }

  // Note: fn only call once times in prepare
  private async optimizeConnection() {
    const modules = this.getAllModules()
    const modulesKeys = Object.keys(modules)

    const urls = modulesKeys.reduce((acc, key) => {
      const item = modules[key]

      const { main, styles } =
        requireHelpers.parse(item.upstream as any, this._platform) || {}

      return acc.concat(
        getUrlOrigin(main.url) as string,
        ...(styles || []).map(
          (style: any) => getUrlOrigin(style.url) as string,
        ),
      )
    }, [] as string[])

    const deduplicated = Array.from(new Set(urls))
    const isPreconnect = deduplicated.length <= PRECONNECT_LIMIT_DOMAIN
    const dnsPrefetchs = deduplicated.map((item) =>
      DOMHelpers.dnsPrefetch(item, isPreconnect),
    )
    dnsPrefetchs.forEach((item) => this._dnsPrefetchs.add(item))

    return dnsPrefetchs
  }

  async prepare() {
    this.bindVendors()

    if (this._dev) {
      // Call to check and use linked modules if availability
      // Note: this feature take time for wait to ready
      await this.linkModules()
    }

    // Check and prepare connections for resources
    this.optimizeConnection()

    // Preload resources
    await this.preload()

    // Fired event to inform for other know modules is ready
    await this._readyPromise.promise
    this._readyPromise.resolve(true)
  }

  async ready() {
    return await Promise.all([this._readyPromise.promise])
  }

  async preload() {
    const modules = this.getAllModules()
    const preload = this._config.getPreload()

    const pings: Promise<boolean>[] = []
    for (const name of preload) {
      const item = modules[name] as RequiredBaseItem
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
    await this.ready()

    const modules = this.getAllModules()

    const item = modules[name] as RequiredBaseItem
    if (!item) {
      throw new Error(`Cannot load module by name: ${name}.`)
    }

    const resolved = await this.load<M>(item)
    return resolved
  }

  // Ensure modules is ready before use!
  getTagsInHead(): TagElement[] {
    const preconnects = Array.from(this._dnsPrefetchs.values())
    const resources = this._pingResources.values()

    const tags = [
      this._ssr && DOMHelpers.sharedConfig(this._config.raw()),
      ...preconnects,
    ].filter(Boolean) as TagElement[]

    resources.forEach((item) => {
      tags.push(item.script, ...(item.styles || []))
    })

    return tags
  }
}

export default Modules
