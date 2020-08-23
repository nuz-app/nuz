import { NUZ_REGISTRY_URL, SHARED_CONFIG_KEY } from '@nuz/shared'
import {
  DeferedPromise,
  checkIsObject,
  checkIsProductionMode,
  deferedPromise,
  ensureOrigin,
  getFetchUrls,
} from '@nuz/utils'

import { BootstrapConfiguration, RuntimePlatforms } from '../types'
import { Config, initializeConfig } from '../utils/effects/getConfig'
import { Modules, initializeModules } from '../utils/effects/getModules'
import fetchConfig from '../utils/fetchConfig'
import getCurrentPlatform from '../utils/getCurrentPlatform'
import * as logger from '../utils/logger'
import uniq from '../utils/uniq'

/**
 * Timeout when calling to get configuration information
 */
const FETCH_CONFIG_TIMEOUT = 10000

/**
 *  Limit the number of retries
 */
const FETCH_CONFIG_RETRIES = 1

/**
 *  Timeout to call to check update configuration
 */
const CHECK_UPDATE_TIMEOUT = checkIsProductionMode() ? 30000 : 5000

/**
 * Merge local and upstream configuration into once
 */
function mergeConfiguration<C extends BootstrapConfiguration>(
  local: C,
  upstream?: C,
): C {
  const { modules: modulesInLocal, preload: preloadInLocal } = local
  const { modules: modulesOnUpstream, preload: preloadOnUpstream } =
    upstream || ({} as C)

  return Object.assign({}, local, {
    preload: uniq(preloadOnUpstream, preloadInLocal),
    modules: Object.assign({}, modulesOnUpstream, modulesInLocal),
  })
}

/**
 * Make sure configuration defined important fields
 */
function ensureConfiguration<C extends BootstrapConfiguration>(
  configuration: C,
): C {
  const { registry, ssr, global, ...rest } = configuration

  return Object.assign({}, rest, {
    registry: registry || NUZ_REGISTRY_URL, // default is value of `NUZ_REGISTRY_URL`
    ssr: typeof ssr === 'boolean' ? ssr : false, // default is `false`
    global: typeof global === 'boolean' ? global : true, // default is `true`
  }) as C
}

async function transformConfiguration<C extends BootstrapConfiguration>(
  local: C,
): Promise<C> {
  const { registry, compose: composeId } = local

  const isNode = getCurrentPlatform() === RuntimePlatforms.node
  const registryUrl = ensureOrigin(registry as string) as string
  const isInitialized =
    !isNode && composeId && checkIsObject((window as any)[SHARED_CONFIG_KEY])

  let updated = !isInitialized
    ? undefined
    : ((window as any)[SHARED_CONFIG_KEY] as C)

  if (composeId && !updated) {
    updated = await fetchConfig<C>(
      getFetchUrls.compose(composeId, registryUrl),
      {
        timeout: FETCH_CONFIG_TIMEOUT,
      },
      FETCH_CONFIG_RETRIES,
    )
  }

  return mergeConfiguration(local, updated) as C
}

class Processs {
  private readonly ready: DeferedPromise<boolean>

  private scheduledToUpdate: boolean

  /**
   * Configuration manager
   */
  private config?: Config

  /**
   * Modules manager
   */
  private modules?: Modules

  /**
   * Bootstrap configuration
   */
  private configured?: BootstrapConfiguration

  constructor() {
    // Create defered promise to detect ready status
    this.ready = deferedPromise<boolean>()

    // Use to duplicated calls to update
    this.scheduledToUpdate = false
  }

  private async update(): Promise<void> {
    try {
      const config = await transformConfiguration(
        this.configured as BootstrapConfiguration,
      )

      if (!this.config) {
        throw new Error('The process did not run in sequence')
      }

      this.config.unlock()
      this.config.update(
        Object.assign(
          { vendors: {}, shared: {}, preload: [], modules: {} },
          config,
        ),
      )
      this.config.lock()
    } catch (error) {
      logger.error(
        `There was an error updating the configuration, see details:`,
        error,
      )
    }
  }

  public async isReady(): Promise<boolean> {
    return this.ready.promise
  }

  public async initialize(configAsRaw: BootstrapConfiguration): Promise<void> {
    // Save the initialize configuration value
    this.configured = ensureConfiguration(configAsRaw)

    // Transform configuration
    const config = await transformConfiguration(this.configured)

    this.config = initializeConfig(config)
    this.config.lock()

    // Initialize the modules manager
    this.modules = initializeModules()
    await Promise.all([this.modules.prepare(), this.modules.isReady()])

    // Fired a callback if everything's ok
    this.ready.resolve(true)
  }

  public async checkUpdate(cleanUp?: () => any): Promise<boolean> {
    if (!this.configured) {
      throw new Error('The process did not run in sequence')
    }

    if (this.scheduledToUpdate) {
      return false
    }

    setTimeout(() => (this.scheduledToUpdate = false), CHECK_UPDATE_TIMEOUT)
    this.scheduledToUpdate = true

    // Call to update configuration
    await this.update()

    // Hook to trigger on clean up step
    if (typeof cleanUp === 'function') {
      cleanUp()
    }

    return true
  }
}

export default Processs
