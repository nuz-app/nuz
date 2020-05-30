import { ModuleFormats } from '@nuz/shared'
import {
  checkIsObject,
  deferedPromise,
  DeferedPromise,
  ensureOrigin,
  getFetchUrls,
  interopRequireDefault,
  jsonHelpers,
  moduleIdHelpers,
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
import * as moduleHelpers from '../utils/moduleHelpers'
import * as requireHelpers from '../utils/requireHelpers'

import Caches from './Caches'
import Globals from './Globals'
import Linked from './Linked'
import Script from './Script'

const CONFIG_FIND_MODULE_TIMEOUT = 10000
const CONFIG_FIND_MODULE_RETRIES = 1

export type RequiredBaseItem = BaseItemConfig &
  Required<
    Pick<
      BaseItemConfig,
      'id' | 'version' | 'name' | 'local' | 'alias' | 'exportsOnly' | 'upstream'
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

function findModules(
  id: string,
  modules: RequiredBaseItem[],
): RequiredBaseItem | undefined {
  let match = modules.find((item) => item.id === id)
  if (!match) {
    const parsed = moduleIdHelpers.parser(id)
    if (parsed.version === '*') {
      match = modules.find((item) => item.name === parsed.module)
    }
  }

  return match
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
  private readonly _requiredModules: Caches<string, LoadResult<any>>
  private readonly _requiredDependencies: Caches<string, any>
  private readonly _modulesOnRegistry: Caches<string, RequiredBaseItem>
  private readonly _pingResources: Caches<
    string,
    { script: TagElement; styles: TagElement[] }
  >
  private readonly _dnsPrefetchs: Set<TagElement>
  private readonly _requiredResources?: LRUCache<any, any>
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

    // Init maps for required modules, shared and ping resources
    this._requiredDependencies = new Caches()
    this._requiredModules = new Caches()
    this._modulesOnRegistry = new Caches()
    this._pingResources = new Caches()
    this._dnsPrefetchs = new Set()

    // Create defered promise to checking ready
    this._ready = deferedPromise<boolean>()

    // Check SSR mode is valid
    const isNode = this._platform === RuntimePlatforms.node
    const isUseSSR = this._config.get<boolean>('ssr')
    this._ssr = isUseSSR && isNode

    // Create required resources cache
    this._requiredResources =
      this._ssr && !this._dev ? initialCacheInNode() : undefined

    if (!isUseSSR && isNode) {
      throw new Error(
        `Can't run in Node environment if not enable server-side rendering`,
      )
    }
  }

  private moduleId(item: RequiredBaseItem) {
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

    const cacheId = this.moduleId(item)
    if (this._pingResources.has(cacheId)) {
      return true
    }

    const { upstream } = item
    const requireUrls = requireHelpers.parse(upstream) || {}
    const { main, styles } = requireUrls || ({} as any)

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
   * Require shared dependency by id
   */
  private async requireSharedDependency(id: string) {
    if (this._requiredDependencies.has(id)) {
      return this._requiredDependencies.get(id)
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

    const requiredDependency = await Promise.resolve(dependencyFactory())
    const moduleExports = moduleHelpers.define(requiredDependency, {
      module: true,
      shared: true,
    })

    this._globals.setDependency(name, moduleExports)
    this._requiredDependencies.set(name, moduleExports)

    return requiredDependency
  }

  /**
   * Require shared dependencies for the module
   */
  private async requireSharedDependencies(shared: string[]) {
    return Promise.all(
      (shared || []).map((item) => this.requireSharedDependency(item)),
    )
  }

  /**
   * Run script and pick module exports
   */
  private runScript({
    id,
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
      id,
    })

    if (!checkIsFunction(moduleExports.default)) {
      throw new Error('Module is not exported!')
    }

    // TODO: must be checked prcoess before flush context
    // this.flushContext(context, library)

    return moduleExports
  }

  /**
   * Require the module on upstream
   */
  private async requireOnUpstream(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
  ) {
    const { id, upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)
    const { timeout, retries } = ensureLoadModuleConfig(options)

    const { main, styles } = requireHelpers.parse(upstream) || {}

    const moduleScript = await getScript(
      main.url,
      {
        resolver: this._requiredResources,
        timeout,
        integrity: main.integrity,
        sourceMap: this._dev,
      },
      retries,
    )

    const moduleExports = this.runScript({
      id,
      format,
      library,
      alias,
      exportsOnly,
      code: moduleScript,
    })

    const moduleStyles = await Promise.all(
      (styles || []).map((style) =>
        DOMHelpers.loadStyle(style.url, {
          sourceMap: this._dev,
          resolver: this._requiredResources,
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
   * Require the module in linked workspaces
   */
  private async requireInLinked(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
  ) {
    if (!this._linked.exists(item.id)) {
      return null
    }

    const required = await this.requireOnUpstream(item, options)

    moduleHelpers.define(required.module, {
      linked: true,
    })

    //  Watch and reload if module was changed, only client-side
    if (!this._ssr) {
      this._linked.watch([item.id])
    }

    return required
  }

  /**
   * Require the module in local
   */
  private async requireInLocal(
    item: Required<
      Pick<BaseItemConfig, 'name' | 'local' | 'alias' | 'exportsOnly'>
    >,
    options?: LoadModuleConfig,
  ) {
    const { name, local, alias, exportsOnly } = item

    const requiredInLocal = local || requireHelpers.local(name, this._globals)
    if (!requiredInLocal) {
      return null
    }

    let moduleExports = Object.assign(
      {},
      interopRequireDefault(requiredInLocal),
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
   * Require the module by config
   */
  private async require(item: RequiredBaseItem, options?: LoadModuleConfig) {
    await this.requireSharedDependencies((item as any).shared)

    // In development mode, allowed to require in local and linked
    if (this._dev) {
      const requiredInLocal = await this.requireInLocal(item, options)
      if (requiredInLocal) {
        return requiredInLocal
      }

      const requiredInLinked = await this.requireInLinked(item, options)
      if (requiredInLinked) {
        return requiredInLinked
      }
    }

    try {
      const requiredOnUpstream = await this.requireOnUpstream(item, options)
      return requiredOnUpstream
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

      const requiredOnFallback = await this.requireOnUpstream(cloned, options)
      return requiredOnFallback
    }
  }

  /**
   * Load a module by config
   */
  private async loadModule<M = unknown>(
    item: RequiredBaseItem,
    options?: LoadModuleConfig,
  ): Promise<LoadResult<M>> {
    if (!item.id) {
      throw new Error('Not found module id')
    }

    let requiredModule
    const cacheId = item.id
    // In server-side mode will not use cache required modules
    // maybe cache the module resources rather than cache required
    if (!this._ssr && this._requiredModules.has(cacheId)) {
      return this._requiredModules.get(cacheId) as any
    }

    requiredModule = await this.require(item, options)
    this._requiredModules.set(cacheId, requiredModule)

    return requiredModule
  }

  /**
   * Optimize the connection for modules and resources
   */
  private async optimizeConnection() {
    const modulesMap = this.getAllModules()
    const modules = Object.values(modulesMap)

    const urls = modules.reduce((acc, item) => {
      const { main, styles } = requireHelpers.parse(item?.upstream as any) || {}

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
  private async resolveOnRegistry(id: string) {
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
          timeout: CONFIG_FIND_MODULE_TIMEOUT,
        },
        CONFIG_FIND_MODULE_RETRIES,
      )
      this._modulesOnRegistry.set(id, config)

      return config
    } catch {
      return
    }
  }

  /**
   * Handle preload modules configured in bootstrap
   */
  private preload() {
    const modulesMap = this.getAllModules()
    const modules = Object.values(modulesMap) as RequiredBaseItem[]
    const preload = this._config.get<NonNullable<BootstrapConfig['preload']>>(
      'preload',
    )
    const transformed = preload.map((idOrName) => moduleIdHelpers.use(idOrName))

    const pings: boolean[] = []
    for (const id of transformed) {
      const item = findModules(id, modules) as RequiredBaseItem
      if (!item) {
        continue
      }

      pings.push(this.ping(item, { styles: true }))
    }

    return pings
  }

  /**
   * Call to prepare everything before using the modules
   */
  public async prepare() {
    this.bindVendors()

    if (this._dev) {
      // Call to check and use linked modules if availability
      // Note: this feature take time for wait to ready
      await this.linkModules()
    }

    await Promise.all([
      // Check and prepare connections for resources
      this.optimizeConnection(),
    ])

    // Fired event to inform for other know modules is ready
    this._ready.resolve(true)
  }

  /**
   * Ready state of the modules
   */
  public async ready() {
    await this._ready.promise
  }

  /**
   * Require a module by id
   */
  public async requireModule<T = unknown>(id: string): Promise<T> {
    const required = await this.findAndLoadModule<T>(id)

    return required?.module
  }

  /**
   * Resolve a module by id
   */
  public async resolveModule(id: string): Promise<RequiredBaseItem> {
    await this.ready()

    const modulesMap = this.getAllModules()
    const modules = Object.values(modulesMap) as RequiredBaseItem[]

    let item = findModules(id, modules)
    if (!item) {
      item = (await this.resolveOnRegistry(id)) as RequiredBaseItem
    }

    if (!item) {
      throw new Error(`Can't require ${id} module`)
    }

    return item
  }

  /**
   * Find and load the module by id
   */
  public async findAndLoadModule<M = unknown>(
    id: string,
  ): Promise<LoadResult<M>> {
    const item = (await this.resolveModule(id)) as RequiredBaseItem
    const required = await this.loadModule<M>(item)

    return required
  }

  /**
   * Get all elements need to append in `<head />`
   * Only server-side mode
   */
  public getElementsInHead(preloadIdOrNames: string[] = []): TagElement[] {
    // Ensure ping resources empty beforepreload all
    this._pingResources.clear()

    // Preload all resources set in `preload` field
    this.preload()

    const modulesMap = this.getAllModules()
    const modules = Object.values(modulesMap) as RequiredBaseItem[]
    const preloadIds = preloadIdOrNames.map((idOrName) =>
      moduleIdHelpers.use(idOrName),
    )
    const preloadModules = [] as RequiredBaseItem[]

    // Preload for dynamic modules
    for (const id of preloadIds) {
      const item = findModules(id, modules)
      if (!item) {
        continue
      }

      this.ping(item as RequiredBaseItem, {
        styles: false,
      })
      preloadModules.push(item)
    }

    const resources = this._pingResources.values()
    const preconnects = Array.from(this._dnsPrefetchs.values())

    const tags = [
      this._ssr && DOMHelpers.sharedConfig(this._config.export()),
      ...preconnects,
    ].filter(Boolean) as TagElement[]

    for (const item of resources) {
      tags.push(item.script, ...(item.styles || []))
    }

    for (const preloadItem of preloadModules) {
      const item = this._requiredModules.get(preloadItem.id)
      if (!item) {
        continue
      }

      tags.push(...(item.styles || []))
    }

    // Clean up all ping resources
    this._pingResources.clear()

    return tags
  }
}

export default Modules
