import {
  DeferedPromise,
  deferedPromise,
  ensureOrigin,
  getFetchUrls,
  interopRequireDefault,
  moduleIdHelpers,
} from '@nuz/utils'

import {
  BaseModuleConfiguration,
  BootstrapConfiguration,
  LoadModuleConfiguration,
  ModulesConfig,
  RequiredModuleConfiguration,
  RuntimePlatforms,
  VendorsConfig,
} from '../types'
import checkIsFunction from '../utils/checkIsFunction'
import convertMapToObject from '../utils/convertMapToObject'
import * as documentHelpers from '../utils/documentHelpers'
import downloadResource from '../utils/downloadResource'
import getConfig, { Config } from '../utils/effects/getConfig'
import fetchConfig from '../utils/fetchConfig'
import findModuleById from '../utils/findModuleById'
import getCurrentPlatform from '../utils/getCurrentPlatform'
import getExportsModule from '../utils/getExportsModule'
import getModuleId from '../utils/getModuleId'
import initializeLRUCache, { LRUCache } from '../utils/initializeLRUCache'
import * as logger from '../utils/logger'
import mergeModuleConfiguration from '../utils/mergeModuleConfiguration'
import * as moduleHelpers from '../utils/moduleHelpers'
import * as requireHelpers from '../utils/requireHelpers'

import Caches from './Caches'
import Globals from './Globals'
import Linked from './Linked'
import Script from './Script'

/**
 * Timeout when calling to find module information on the registry
 */
const FIND_MODULE_TIMEOUT = 10000

/**
 *  Limit the number of retries when find module on the reigstry
 */
const FIND_MODULE_RETRIES = 1

/**
 * Timeout when calling to load module information on the registry
 */
const LOAD_MODULE_TIMEOUT = 10000

/**
 *  Limit the number of retries when load module on the reigstry
 */
const LOAD_MODULE_RETRIES = 1

/**
 * Limit the number of preconnect domain,
 * if larger, switch to using prefetch-dns.
 */
const PRECONNECT_LIMIT_DOMAIN = 3

let wsWarningIsShowed = false

type TagElement = documentHelpers.DefinedElement

export interface ResolvedModule<M extends unknown> {
  module: M
  styles: TagElement[]
}

class Modules {
  /**
   * Is ready state
   */
  private readonly ready: DeferedPromise<boolean>

  /**
   * Config manager
   */
  private readonly config: Config

  /**
   * Current platform
   */
  private readonly platform: RuntimePlatforms

  /**
   * Globals instance
   */
  private readonly globals: Globals

  /**
   * Is development mode
   */
  private readonly dev: boolean

  /**
   * Is server-side rendering
   */
  private readonly ssr: boolean

  /**
   * Store all resolved modules
   */
  private readonly resolvedModules: Caches<string, ResolvedModule<any>>

  /**
   * Store all resolved dependencies
   */
  private readonly resolvedDependencies: Caches<string, any>

  /**
   * Store all modules resolved on the registry
   */
  private readonly resolvedRegistry: Caches<string, RequiredModuleConfiguration>

  /**
   * Resources need to preload
   */
  private readonly resourcesPreload: Caches<
    string,
    { script: TagElement; styles: TagElement[] }
  >

  /**
   * All dns-prefetch elements
   */
  private readonly dnsPrefetchs: Set<TagElement>

  /**
   * The cache resolver
   */
  private readonly cacheResolver?: LRUCache<any, any>

  /**
   * Internal modules manager (aka linked modules)
   */
  private internalModules?: Linked

  constructor() {
    const config = getConfig()
    if (!config || !(config instanceof Config)) {
      throw new Error(
        'The configuration manager could not be found, possibly the incorrect initialization sequence.',
      )
    }

    //
    this.config = config
    this.platform = getCurrentPlatform()
    this.globals = new Globals({
      platform: this.platform,
      context: this.config.get('context'),
    })
    this.dev = this.config.get<boolean>('dev')

    //
    this.resolvedDependencies = new Caches()
    this.resolvedModules = new Caches()
    this.resolvedRegistry = new Caches()
    this.resourcesPreload = new Caches()
    this.dnsPrefetchs = new Set()

    // Create defered promise to detect ready status
    this.ready = deferedPromise<boolean>()

    // Detect current platform and server-side rendering mode
    const isNode = this.platform === RuntimePlatforms.node
    const isUseSSR = this.config.get<boolean>('ssr')
    const ssrIsEnabled = isUseSSR && isNode
    const ssrIsInvalid = !isUseSSR && isNode
    if (ssrIsInvalid) {
      throw new Error(
        `Turn on server-side rendering to run on the server environment`,
      )
    }
    this.ssr = ssrIsEnabled

    // Create required resources cache
    this.cacheResolver =
      this.ssr && !this.dev ? initializeLRUCache() : undefined
  }

  /**
   * Make connection internal modules
   */
  private async connectInternalModules(): Promise<void> {
    const { port } = this.config.get<
      NonNullable<BootstrapConfiguration['linked']>
    >('linked')
    // Create internal modules manager
    this.internalModules = new Linked({ port })

    if (!wsWarningIsShowed && port) {
      wsWarningIsShowed = true
      console.warn(
        `Please make sure the workspace server was started on port ${port}.`,
      )
    }

    // Prepare internal modules
    await this.internalModules.prepare()
  }

  /**
   * Get all loaded modules
   */
  private getLoadedModules(includeGlobals: boolean): ModulesConfig {
    const loadedModules = Object.assign(
      {},
      this.config.get<ModulesConfig>('modules'),
    )

    // For development mode, push internal modules to list
    if (this.dev) {
      Object.assign(
        loadedModules,
        Config.transforms(this.internalModules?.getModules() as ModulesConfig),
      )
    }

    // Allow to push modules resolved on the registry
    // to list in some case.
    if (includeGlobals) {
      Object.assign(
        loadedModules,
        convertMapToObject(this.resolvedRegistry.export()),
      )
    }

    return loadedModules
  }

  /**
   * Check if the module is installed
   */
  private isInstalled(item: RequiredModuleConfiguration): boolean {
    const { name, local } = item

    return !!(local || requireHelpers.local(name, this.globals))
  }

  /**
   * Create a safe context can initialize the module
   */
  private createContext(): any {
    return Object.create(this.globals.getContext())
  }

  /**
   * Install vendor dependencies
   */
  private installVendorDependencies(): void {
    const vendors = this.config.get<VendorsConfig>('vendors')

    const keys = Object.keys(vendors)
    for (const key of keys) {
      const dependency = Object.assign(
        {},
        vendors[key],
        interopRequireDefault(vendors[key]),
      )

      // Set vendor dependency to global
      this.globals.installDependency(
        key,
        // Define properties for vendor dependency
        moduleHelpers.define(dependency, {
          module: true,
          vendor: true,
        }),
      )
    }
  }

  /**
   * Ping to generate preconnect for the resource
   */
  private ping(
    item: RequiredModuleConfiguration,
    options: { styles: boolean },
  ): boolean {
    const { styles: isPingStyles } = Object.assign({ styles: true }, options)

    const isInstalled = this.dev && this.isInstalled(item)
    if (isInstalled) {
      return false
    }

    const moduleId = getModuleId(item)
    if (this.resourcesPreload.has(moduleId)) {
      return true
    }

    const { upstream } = item
    const { main, styles } = requireHelpers.parse(upstream) || ({} as any)

    // Create preload script for the resource
    const preloadScript = documentHelpers.preloadScript(main.url, {
      sourceMap: this.dev,
      integrity: main.integrity,
    })

    // Create preload styles for the resource
    const preloadStyles = !isPingStyles
      ? []
      : styles.map((style: any) =>
          documentHelpers.preloadStyle(style.url, {
            sourceMap: this.dev,
            integrity: style.integrity,
          }),
        )

    this.resourcesPreload.set(moduleId, {
      script: preloadScript,
      styles: preloadStyles,
    })

    return true
  }

  /**
   * Install the shared dependency
   */
  private async installSharedDependency(id: string): Promise<any> {
    if (this.resolvedDependencies.has(id)) {
      return this.resolvedDependencies.get(id)
    }

    const dependencies = this.config.get<
      NonNullable<BootstrapConfiguration['shared']>
    >('shared')

    const factory = dependencies[id]
    if (!factory || !checkIsFunction(factory)) {
      throw new Error(
        `Cannot find factory of ${JSON.stringify(
          id,
        )} or factory which is not a function.`,
      )
    }

    const resolved = await Promise.resolve(factory())
    const dependency = moduleHelpers.define(resolved, {
      module: true,
      shared: true,
    })

    this.globals.installDependency(name, dependency)
    this.resolvedDependencies.set(name, dependency)

    return dependency
  }

  /**
   * Install the shared dependencies
   */
  private async installSharedDependencies(shared: string[]): Promise<any> {
    return Promise.all(
      (shared || []).map((item) => this.installSharedDependency(item)),
    )
  }

  /**
   * Initialize a module
   */
  private initializeModule<M extends unknown>(
    configuration: BaseModuleConfiguration & { code: string },
  ): M {
    const { id, code, library, alias, exportsOnly } = configuration

    const context = this.createContext()
    let resolved: any

    try {
      const executor = this.ssr ? Script.executeOnNode : Script.executeOnBrowser
      // Extract the module from the executable context
      resolved = getExportsModule(executor(code, context), library)

      // Ensure the module properties are full
      resolved = Object.assign({}, interopRequireDefault(resolved), resolved)

      // Define properties for the module
      resolved = moduleHelpers.define(
        // Alias and and remove unnecessary properties
        moduleHelpers.transform(resolved, {
          alias,
          exportsOnly,
        }),
        {
          module: true,
          upstream: true,
          id,
        },
      )
    } catch (error) {
      throw new Error(
        `An error occurred during module initialization, details: ${error.message}.`,
      )
    }

    // Ensure exports default is exists
    if (!checkIsFunction(resolved.default)) {
      throw new Error(
        'Something wrong happened, the module initialized was not valid.',
      )
    }

    return resolved
  }

  /**
   * Resolve the module online
   */
  private async resolveOnline<M extends unknown>(
    item: RequiredModuleConfiguration,
    configuration?: LoadModuleConfiguration,
  ): Promise<ResolvedModule<M>> {
    const { id, upstream } = item
    const { library, format, alias, exportsOnly } = mergeModuleConfiguration(
      upstream,
      item,
    )
    const { timeout, retries } = Object.assign(
      { timeout: LOAD_MODULE_TIMEOUT, retries: LOAD_MODULE_RETRIES },
      configuration,
    )

    // Parse to get information about module styles and script
    const { main, styles } = requireHelpers.parse(upstream) || {}

    // Download module script content
    const code = await downloadResource(
      main.url,
      {
        resolver: this.cacheResolver,
        timeout,
        integrity: main.integrity,
        sourceMap: this.dev,
      },
      retries,
    )

    // Initialize the module
    const moduleExports = this.initializeModule<M>({
      id,
      format,
      library,
      alias,
      exportsOnly,
      code,
    })

    // Prepare the styles for the module
    const moduleStyles = await Promise.all(
      (styles || []).map((style) =>
        documentHelpers.loadStyle(style.url, {
          sourceMap: this.dev,
          resolver: this.cacheResolver,
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
   * Resolve the module from workspaces, internal.
   */
  private async resolveInternal<M extends unknown>(
    item: RequiredModuleConfiguration,
    options?: LoadModuleConfiguration,
  ): Promise<ResolvedModule<M> | null> {
    if (!this.internalModules?.exists(item.id)) {
      return null
    }

    const resolved = await this.resolveOnline<M>(item, options)
    moduleHelpers.define<M>(resolved.module, {
      linked: true,
    })

    // Follow the module to notice the update and
    // reload the page, client side only.
    if (!this.ssr) {
      this.internalModules.watch([item.id])
    }

    return resolved
  }

  /**
   * Resolve the module was installed
   */
  private async resolveInstalled<M extends unknown>(
    item: Required<
      Pick<BaseModuleConfiguration, 'name' | 'local' | 'alias' | 'exportsOnly'>
    >,
    options?: LoadModuleConfiguration,
  ): Promise<ResolvedModule<M> | null> {
    const { name, local, alias, exportsOnly } = item

    let resolved = local || requireHelpers.local(name, this.globals)
    if (!resolved) {
      return null
    }

    // Alias and and remove unnecessary properties
    resolved = moduleHelpers.transform<M>(
      Object.assign({}, interopRequireDefault(resolved)),
      {
        alias,
        exportsOnly,
      },
    )

    // Define properties for the module installed
    resolved = moduleHelpers.define<M>(resolved, {
      module: true,
      local: true,
    })

    return {
      module: resolved,
      styles: [],
    }
  }

  /**
   * Resolve the module
   */
  private async resolve<M extends unknown>(
    item: RequiredModuleConfiguration,
    options?: LoadModuleConfiguration,
  ): Promise<ResolvedModule<M>> {
    const { fallback } = item

    // Install necessary dependencies
    await this.installSharedDependencies((item as any).shared)

    // The module resolved instance
    let resolved: any

    // Only resolve installed and internal module
    // in development mode
    if (this.dev) {
      // Try to resolve the module was installed
      resolved = await this.resolveInstalled(item, options)

      // If not found installed, try to resolve internal module
      if (!resolved) {
        resolved = (await this.resolveInternal(item, options)) as any
      }

      // Return the module if found
      if (resolved) {
        return resolved
      }
    }

    try {
      return await this.resolveOnline(item, options)
    } catch (error) {
      if (!fallback) {
        throw new Error(
          `An error occurred while resolving the module online and couldn't find a fallback to handle. Other: ${error.message}`,
        )
      }

      logger.error(
        `An error occurred while resolving the module online, trying to fallback. Error: `,
        error,
      )

      return await this.resolveOnline(
        Object.assign({}, item, {
          upstream: fallback,
          fallback: undefined,
        }),
        options,
      )
    }
  }

  /**
   * Load the module
   */
  private async load<M extends unknown>(
    item: RequiredModuleConfiguration,
    options?: LoadModuleConfiguration,
  ): Promise<ResolvedModule<M>> {
    const moduleId = getModuleId(item)
    // In server-side mode will not use cache required modules
    // maybe cache the module resources rather than cache required
    if (!this.ssr && this.resolvedModules.has(moduleId)) {
      return this.resolvedModules.get(moduleId) as any
    }

    const resolved = await this.resolve<M>(item, options)
    this.resolvedModules.set(moduleId, resolved)

    return resolved
  }

  /**
   * Optimize the connection for modules and resources
   */
  private async optimizeConnection(): Promise<TagElement[]> {
    const loadedModules = Object.values(this.getLoadedModules(true))
    const urls = loadedModules.reduce((acc, item) => {
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
      const dnsPrefetch = documentHelpers.dnsPrefetch(item, isPreconnect)
      this.dnsPrefetchs.add(dnsPrefetch)
      dnsPrefetchs.push(dnsPrefetch)
    }

    return dnsPrefetchs
  }

  /**
   * Find the module on global
   */
  private async findGlobal(
    id: string,
  ): Promise<RequiredModuleConfiguration | null | undefined> {
    const canUseGlobal = this.config.get('global')
    if (!canUseGlobal) {
      return null
    }

    if (this.resolvedRegistry.has(id)) {
      return this.resolvedRegistry.get(id)
    }

    try {
      const configuration = await fetchConfig<RequiredModuleConfiguration>(
        getFetchUrls.module(id, this.config.get('registry') as string),
        {
          timeout: FIND_MODULE_TIMEOUT,
        },
        FIND_MODULE_RETRIES,
      )
      this.resolvedRegistry.set(id, configuration)

      return configuration
    } catch (error) {
      return null
    }
  }

  /**
   * Preload modules configured
   */
  private preloadModules(): boolean[] {
    const loadedModules = Object.values(
      this.getLoadedModules(true),
    ) as RequiredModuleConfiguration[]

    // Get preload module ids
    const preloadIds = this.config
      .get<NonNullable<BootstrapConfiguration['preload']>>('preload')
      .map((idOrName) => moduleIdHelpers.use(idOrName))

    const pings: boolean[] = []
    for (const moduleId of preloadIds) {
      const item = findModuleById(
        loadedModules,
        moduleId,
      ) as RequiredModuleConfiguration

      // Skip if not found module configuration
      if (!item) {
        continue
      }

      // Ping resource for the module
      pings.push(this.ping(item, { styles: true }))
    }

    return pings
  }

  /**
   * Prepare the module manager
   */
  public async prepare(): Promise<void> {
    // Install all vendor dependencies
    this.installVendorDependencies()

    // For development mode, allow to use internal modules
    if (this.dev) {
      // Note: this feature take time for wait to ready
      await this.connectInternalModules()
    }

    // Check and prepare connections for resources
    await this.optimizeConnection()

    // Fired event to inform for other know modules is ready
    this.ready.resolve(true)
  }

  /**
   * Check that the module manager is ready for use.
   */
  public async isReady(): Promise<boolean> {
    return await this.ready.promise
  }

  /**
   * Require the module
   */
  public async require<M extends unknown>(id: string): Promise<M> {
    const resolved = await this.install<M>(id)
    return resolved.module
  }

  /**
   * Find the module
   */
  public async find(id: string): Promise<RequiredModuleConfiguration> {
    // Make sure the module manager is ready to use
    await this.isReady()

    const loadedModules = Object.values(
      this.getLoadedModules(false),
    ) as RequiredModuleConfiguration[]

    // Find modules loaded modules
    let item = findModuleById(loadedModules, id)

    // If not found in loaded modules,
    // try to find in global if allowed.
    if (!item) {
      item = (await this.findGlobal(id)) as RequiredModuleConfiguration
    }

    if (!item) {
      throw new Error(`Cannot find module ${JSON.stringify(id)}`)
    }

    return item
  }

  /**
   * Find and resolve the module
   */
  public async install<M = unknown>(id: string): Promise<ResolvedModule<M>> {
    const item = (await this.find(id)) as RequiredModuleConfiguration

    return await this.load<M>(item)
  }

  /**
   * For server-side rendering
   * Preload elements and append into head
   */
  public getPreloadElements(preloadIdOrNames: string[] = []): TagElement[] {
    // Make sure resource preload is empty before process
    this.resourcesPreload.clear()

    // Preload all resources set in `preload` field
    this.preloadModules()

    const loadedModules = Object.values(
      this.getLoadedModules(true),
    ) as RequiredModuleConfiguration[]

    // Get all preload module ids
    const preloadIds = preloadIdOrNames.map((idOrName) =>
      moduleIdHelpers.use(idOrName),
    )
    const preloadModules = [] as RequiredModuleConfiguration[]

    // Preload for dynamic modules
    for (const id of preloadIds) {
      const item = findModuleById(loadedModules, id)
      if (!item) {
        continue
      }

      this.ping(item as RequiredModuleConfiguration, {
        styles: false,
      })
      preloadModules.push(item)
    }

    const resources = this.resourcesPreload.values()
    const preconnects = Array.from(this.dnsPrefetchs.values())

    const {
      preload: exportsPreload,
      modules: exportsModules,
    } = this.config.export()

    //
    const tags = [
      this.ssr &&
        documentHelpers.defineSharedConfig({
          preload: exportsPreload,
          modules: Object.assign(
            {},
            convertMapToObject(this.resolvedRegistry.export()),
            exportsModules,
          ),
        }),
      ...preconnects,
    ].filter(Boolean) as TagElement[]

    for (const item of resources) {
      tags.push(item.script, ...(item.styles || []))
    }

    for (const preloadItem of preloadModules) {
      const item = this.resolvedModules.get(preloadItem.id)
      if (!item) {
        continue
      }

      tags.push(...(item.styles || []))
    }

    // Clean up all resources
    this.resourcesPreload.clear()

    return tags
  }
}

export default Modules
