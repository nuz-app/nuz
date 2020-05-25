import { ModuleFormats } from '@nuz/shared'
import {
  checkIsObject,
  deferedPromise,
  DeferedPromise,
  ensureOrigin,
  getFetchUrls,
  jsonHelpers,
} from '@nuz/utils'
import LRUCache from 'lru-cache'

import {
  BaseItemConfig,
  BootstrapConfig,
  LoadModuleConfig,
  ModulesConfig,
  RuntimePlatforms,
  VendorsConfig,
} from '../types'

import checkIsFunction from '../utils/checkIsFunction'
import * as DOMHelpers from '../utils/DOMHelpers'
import getConfig, { Config } from '../utils/effects/getConfig'
import fetchConfig from '../utils/fetchConfig'
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

function initialCacheInNode(): LRUCache<any, any> {
  return new LRUCache({
    max: 50,
    maxAge: 1000 * 60 * 60,
  })
}

function ensureLoadModuleConfig({
  timeout,
  retries,
  ...rest
}: LoadModuleConfig = {}) {
  return {
    ...rest,
    timeout: timeout || 60000,
    retries: retries || 1,
  }
}

function pickNamedExports(context, library?: string): string {
  if (library !== '[name]' && context[library as string]) {
    return library as string
  } else if (context.default) {
    return 'default'
  } else if (context.main) {
    return 'main'
  }

  const keysOf = Object.keys(context)
  const lastKey = keysOf[keysOf.length - 1]
  return lastKey
}

function pickModuleFromContext(context, library?: string) {
  return context[pickNamedExports(context, library)]
}

function pickIfSet(upstream: any, config: RequiredBaseItem) {
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

export interface LoadResult<M = unknown> {
  module: M
  styles: TagElement[]
}

class Modules {
  private readonly _ready: DeferedPromise<boolean>
  private readonly _config: Config
  private readonly _platform: RuntimePlatforms
  private readonly _globals: Globals
  private readonly _dev: boolean
  private readonly _ssr: boolean
  private readonly _resolvedModules: Caches<string, LoadResult<any>>
  private readonly _resolvedDependencies: Caches<string, any>
  private readonly _modulesOnRegistry: Caches<string, RequiredBaseItem>
  private readonly _pingResources: Caches<
    string,
    { script: TagElement; styles: TagElement[] }
  >
  private readonly _dnsPrefetchs: Set<TagElement>
  private readonly _resolvedResources?: LRUCache<any, any>
  // @ts-ignore
  private _linked: Linked

  constructor() {
    this._config = getConfig()
    if (!this._config) {
      throw new Error('No configuration to use found')
    }

    this._platform = getRuntimePlatform()
    if (!this._platform) {
      throw new Error('Unable to determine the platform to proceed')
    }

    this._globals = new Globals(this._platform)

    // Set is development mode
    this._dev = this._config.get<boolean>('dev')

    // Init maps for resolved modules, shared and ping resources
    this._resolvedDependencies = new Caches()
    this._resolvedModules = new Caches()
    this._modulesOnRegistry = new Caches()
    this._pingResources = new Caches()
    this._dnsPrefetchs = new Set()

    // Create defered promise to checking ready
    this._ready = deferedPromise<boolean>()

    // Check SSR mode is valid
    const isNode = this._platform === RuntimePlatforms.node
    const isUseSSR = this._config.get<boolean>('ssr')
    this._ssr = isUseSSR && isNode

    // Create resolved resources cache
    this._resolvedResources =
      this._ssr && !this._dev ? initialCacheInNode() : undefined

    if (!isUseSSR && isNode) {
      throw new Error(
        `Can't run in Node environment if not enable server-side rendering`,
      )
    }
  }

  private moduleCacheId(item: RequiredBaseItem) {
    const { id, version, name } = item

    return id || `${name}${version ? `@${version}` : ''}`
  }

  /**
   * Create linked workspaces connect
   */
  private async linkModules() {
    // Create linked instance with bootstrap config
    const config = this._config.get<NonNullable<BootstrapConfig['linked']>>(
      'linked',
    )
    this._linked = new Linked(config)

    if (!wsWarningIsShowed && config.port) {
      wsWarningIsShowed = true
      console.warn(
        `Please make sure the workspace server was started on port ${config.port}.`,
      )
    }

    // Prepare: wait socket ready, binding events,...
    await this._linked.prepare()

    return true
  }

  /**
   * Get all modules config
   */
  private getAllModules() {
    const definedModules = Object.assign(
      {},
      this._config.get<ModulesConfig>('modules'),
    )

    // In development mode, extends modules config with linked modules
    if (this._dev) {
      const linkedModules = this._linked.getModules()
      Object.assign(definedModules, this._config.defineModules(linkedModules))
    }

    return definedModules
  }

  /**
   * Check is can use local module
   */
  private canUseLocal(item: RequiredBaseItem) {
    const { name, local } = item

    return !!(local || requireHelpers.local(name, this._globals))
  }

  /**
   * Create a safe context
   */
  private createContext() {
    return Object.create(this._globals.getContext())
  }

  /**
   * Flush exports module in safe context
   */
  // @ts-ignore
  private flushContext(context: any, library?: string) {
    const namedExports = pickNamedExports(context, library)

    context[namedExports] = undefined
    this._globals.deleteDependency(namedExports)
    this._globals.delete(namedExports)
  }

  /**
   * Bind vendors dependencies to safe context
   */
  private bindVendors() {
    const vendors = this._config.get<VendorsConfig>('vendors')

    const keys = Object.keys(vendors)
    for (const key of keys) {
      const item = vendors[key]
      const vendor = Object.assign({}, item, interopRequireDefault(item))
      const moduleExports = moduleHelpers.define(vendor, {
        module: true,
        vendor: true,
      })
      this._globals.setDependency(key, moduleExports)
    }
  }

  /**
   * Ping to make preconnec for resources of the modules
   */
  private ping(item: RequiredBaseItem, options: { styles: boolean }) {
    const { styles: isPingStyles } = options || {}

    const canUseLocal = this._dev && this.canUseLocal(item)
    if (canUseLocal) {
      return false
    }

    const cacheId = this.moduleCacheId(item)
    if (this._pingResources.has(cacheId)) {
      return true
    }

    const { upstream } = item

    const resolveUrls = requireHelpers.parse(upstream) || {}
    const { main, styles } = resolveUrls || ({} as any)

    const preloadScript = DOMHelpers.preloadScript(main.url, {
      sourceMap: this._dev,
      integrity: main.integrity,
    })

    const preloadStyles = !isPingStyles
      ? []
      : styles.map((style: any) =>
          DOMHelpers.preloadStyle(style.url, {
            sourceMap: this._dev,
            integrity: style.integrity,
          }),
        )

    this._pingResources.set(cacheId, {
      script: preloadScript,
      styles: preloadStyles,
    })

    return true
  }

  /**
   * Load shared dependency by name or id
   */
  private async loadSharedDependency(id: string) {
    if (this._resolvedDependencies.has(id)) {
      return this._resolvedDependencies.get(id)
    }

    const sharedDependencies = this._config.get<
      NonNullable<BootstrapConfig['shared']>
    >('shared')
    const dependencyFactory = sharedDependencies[id]
    if (!dependencyFactory) {
      throw new Error(`Can not found shared dependency by name ${id}`)
    }

    if (!checkIsFunction(dependencyFactory)) {
      throw new Error(`Dependency factory of ${id} is invalid`)
    }

    const resolvedDependency = await Promise.resolve(dependencyFactory())
    const moduleExports = moduleHelpers.define(resolvedDependency, {
      module: true,
      shared: true,
    })

    this._globals.setDependency(name, moduleExports)
    this._resolvedDependencies.set(name, moduleExports)

    return resolvedDependency
  }

  /**
   * Load shared dependencies for the module
   */
  private async loadSharedDependencies(shared: string[]) {
    return Promise.all(
      (shared || []).map((item) => this.loadSharedDependency(item)),
    )
  }

  /**
   * Run script and pick module exports
   */
  private runScript({
    code,
    format,
    library,
    alias,
    exportsOnly,
  }: BaseItemConfig & { format: ModuleFormats; code: string }) {
    let context = this.createContext()

    try {
      const script = new Script(code, {
        format,
      })

      if (this._ssr) {
        context = script.runInContext(context)
      } else {
        context = script.runInScript(context)
      }
    } catch (error) {
      console.error(`Module installed uncaught error, details:`, error)
      throw error
    }

    const moduleInContext = pickModuleFromContext(context, library)

    let moduleExports = Object.assign(
      {},
      interopRequireDefault(moduleInContext),
      moduleInContext,
    )
    moduleExports = moduleHelpers.transform(moduleExports, {
      alias,
      exportsOnly,
    })
    moduleExports = moduleHelpers.define(moduleExports, {
      module: true,
      upstream: true,
    })

    if (!checkIsFunction(moduleExports.default)) {
      throw new Error('Module is not exported!')
    }

    // TODO: must be checked prcoess before flush context
    // this.flushContext(context, library)

    return moduleExports
  }

  /**
   * Resolve the module on upstream
   */
  private async resolveOnUpstream(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
  ) {
    const { upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)
    const { timeout, retries } = ensureLoadModuleConfig(options)

    const { main, styles } = requireHelpers.parse(upstream) || {}

    const moduleScript = await getScript(
      main.url,
      {
        resolver: this._resolvedResources,
        timeout,
        integrity: main.integrity,
        sourceMap: this._dev,
      },
      retries,
    )

    const moduleExports = this.runScript({
      code: moduleScript,
      format,
      library,
      alias,
      exportsOnly,
    })

    const moduleStyles = await Promise.all(
      (styles || []).map((style) =>
        DOMHelpers.loadStyle(style.url, {
          sourceMap: this._dev,
          resolver: this._resolvedResources,
          integrity: style.integrity,
        }),
      ),
    )

    return {
      module: moduleExports,
      styles: moduleStyles,
    }
  }

  /**
   * Resolve the module in linked workspaces
   */
  private async resolveInLinked(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
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

  /**
   * Resolve the module in local
   */
  private async resolveInLocal(
    item: Required<
      Pick<BaseItemConfig, 'name' | 'local' | 'alias' | 'exportsOnly'>
    >,
    options?: LoadModuleConfig,
  ) {
    const { name, local, alias, exportsOnly } = item

    const resolvedInLocal = local || requireHelpers.local(name, this._globals)
    if (!resolvedInLocal) {
      return null
    }

    let moduleExports = Object.assign(
      {},
      interopRequireDefault(resolvedInLocal),
    )
    moduleExports = moduleHelpers.transform(moduleExports, {
      alias,
      exportsOnly,
    })
    moduleExports = moduleHelpers.define(moduleExports, {
      module: true,
      local: true,
    })

    return {
      module: moduleExports,
      styles: [],
    }
  }

  /**
   * Resolve the module by config
   */
  private async resolve(item: RequiredBaseItem, options?: LoadModuleConfig) {
    await this.loadSharedDependencies((item as any).shared)

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

  /**
   * Load a module by config
   */
  private async loadModule<M = unknown>(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
  ): Promise<LoadResult<M>> {
    if (!item.name) {
      throw new Error('Not found name in item config')
    }

    let resolvedModule
    const cacheId = this.moduleCacheId(item)
    // In server-side mode will not use cache resolved modules
    // maybe cache the module resources rather than cache resolved
    if (!this._ssr && this._resolvedModules.has(cacheId)) {
      return this._resolvedModules.get(cacheId) as any
    }

    resolvedModule = await this.resolve(item, options)
    this._resolvedModules.set(cacheId, resolvedModule)

    return resolvedModule
  }

  /**
   * Optimize the connection for modules and resources
   */
  private async optimizeConnection() {
    const modules = this.getAllModules()
    const modulesKeys = Object.keys(modules)

    const urls = modulesKeys.reduce((acc, key) => {
      const { main, styles } =
        requireHelpers.parse(modules[key]?.upstream as any) || {}

      return acc.concat(
        ensureOrigin(main.url) as string,
        ...(styles || []).map(
          (style: any) => ensureOrigin(style.url) as string,
        ),
      )
    }, [] as string[])

    const deduplicated = Array.from(new Set(urls))
    const isPreconnect = deduplicated.length < PRECONNECT_LIMIT_DOMAIN

    const dnsPrefetchs = [] as TagElement[]
    for (const item of deduplicated) {
      const dnsPrefetch = DOMHelpers.dnsPrefetch(item, isPreconnect)
      this._dnsPrefetchs.add(dnsPrefetch)
      dnsPrefetchs.push(dnsPrefetch)
    }

    return dnsPrefetchs
  }

  /**
   * Find the module on registry
   */
  private async findModuleOnRegistry(id: string) {
    const isUseGlobal = this._config.get('global')
    if (!isUseGlobal) {
      return
    }

    if (this._modulesOnRegistry.has(id)) {
      return this._modulesOnRegistry.get(id)
    }

    const registryUrl = this._config.get('registry') as string
    if (!registryUrl) {
      throw new Error('Not found registry url in config')
    }

    const fetchModuleUrl = getFetchUrls.module(id, registryUrl)

    try {
      const config = await fetchConfig<RequiredBaseItem>(
        fetchModuleUrl,
        {
          timeout: 10000,
        },
        1,
      )
      this._modulesOnRegistry.set(id, config)

      return config
    } catch {
      return
    }
  }

  /**
   * Call to prepare everything before using the modules
   */
  async prepare() {
    this.bindVendors()

    if (this._dev) {
      // Call to check and use linked modules if availability
      // Note: this feature take time for wait to ready
      await this.linkModules()
    }

    await Promise.all([
      // Check and prepare connections for resources
      this.optimizeConnection(),
      // Preload resources
      this.preload(),
    ])

    // Fired event to inform for other know modules is ready
    this._ready.resolve(true)
  }

  /**
   * Ready state of the modules
   */
  async ready() {
    await this._ready.promise
  }

  /**
   * Handle preload modules configured in bootstrap
   */
  async preload() {
    const modules = this.getAllModules()
    const valuesOf = Object.values(modules)

    const preload = this._config.get<NonNullable<BootstrapConfig['preload']>>(
      'preload',
    )

    const pings: boolean[] = []
    for (const id of preload) {
      let item = modules[id] as RequiredBaseItem
      if (!item) {
        item = valuesOf.find((m) => m.id === id) as RequiredBaseItem
      }

      if (!item) {
        continue
      }

      pings.push(this.ping(item, { styles: true }))
    }

    return pings
  }

  /**
   * Resolve a module by name or id
   */
  async requireModule<T = unknown>(id: string): Promise<T> {
    console.log('called resolve module', { id })
    const resolved = await this.findAndLoadModule<T>(id)

    return resolved?.module
  }

  /**
   * Find and load the module by name or id
   */
  async findAndLoadModule<M = unknown>(id: string): Promise<LoadResult<M>> {
    await this.ready()

    const modules = this.getAllModules()
    let item = modules[id] as RequiredBaseItem
    if (!item) {
      item = (await this.findModuleOnRegistry(id)) as RequiredBaseItem
    }

    if (!item) {
      throw new Error(`Can't resolve ${id} module`)
    }

    const resolved = await this.loadModule<M>(item)
    return resolved
  }

  /**
   * Get all elements need to append in `<head />`
   */
  getElementsInHead(): TagElement[] {
    const modules = this.getAllModules()
    const resolvedModules = this._resolvedModules.entries()
    if (this._ssr) {
      const valuesOf = Object.values(modules)
      for (const [id] of resolvedModules) {
        let item = modules[id]
        if (!item) {
          item = valuesOf.find((m) => m.id === id) as BaseItemConfig
        }

        if (!item) {
          continue
        }

        this.ping(item as RequiredBaseItem, {
          styles: false,
        })
      }
    }

    const preconnects = Array.from(this._dnsPrefetchs.values())
    const resources = this._pingResources.values()

    const tags = [
      this._ssr && DOMHelpers.sharedConfig(this._config.raw()),
      ...preconnects,
    ].filter(Boolean) as TagElement[]

    for (const item of resources) {
      tags.push(item.script, ...(item.styles || []))
    }

    if (this._ssr) {
      for (const [_, item] of resolvedModules) {
        tags.push(...(item.styles || []))
      }
    }

    return tags
  }
}

export default Modules
