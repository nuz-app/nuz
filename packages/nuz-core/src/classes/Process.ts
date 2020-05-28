import { NUZ_REGISTRY_URL, SHARED_CONFIG_KEY } from '@nuz/shared'
import {
  checkIsObject,
  checkIsProductionMode,
  deferedPromise,
  DeferedPromise,
  ensureOrigin,
  getFetchUrls,
} from '@nuz/utils'

import { BootstrapConfig, RuntimePlatforms } from '../types'

import { Config, initConfig } from '../utils/effects/getConfig'
import getModules, { initModules, Modules } from '../utils/effects/getModules'
import fetchConfig from '../utils/fetchConfig'
import getRuntimePlatform from '../utils/getRuntimePlatform'
import uniq from '../utils/uniq'

const FETCH_CONFIG_TIMEOUT = 10000
const FETCH_CONFIG_RETRIES = 1
const CHECK_UPDATE_TIMEOUT = checkIsProductionMode() ? 30000 : 5000

function mergeConfig(
  localConfig: BootstrapConfig,
  { modules, preload }: BootstrapConfig = {},
): BootstrapConfig {
  return {
    ...localConfig,
    preload: uniq(preload, localConfig.preload),
    modules: { ...modules, ...localConfig.modules },
  }
}

function ensureConfig(config: BootstrapConfig): BootstrapConfig {
  return {
    ...(config || {}),
    registry: config.registry || NUZ_REGISTRY_URL,
    ssr: typeof config.ssr === 'boolean' ? config.ssr : false,
    global: typeof config.global === 'boolean' ? config.global : true,
  }
}

async function transformConfig(config: BootstrapConfig) {
  const registryUrl = ensureOrigin(config.registry as string) as string

  const isNode = getRuntimePlatform() === RuntimePlatforms.node
  const composeIsDefined = !!config.compose
  const sharedIsValid =
    !isNode && composeIsDefined && checkIsObject(window[SHARED_CONFIG_KEY])

  let configOfCompose = !sharedIsValid
    ? undefined
    : (window[SHARED_CONFIG_KEY] as BootstrapConfig)

  if (composeIsDefined && !configOfCompose) {
    const fetchComposeUrl = getFetchUrls.compose(
      config.compose as string,
      registryUrl,
    )

    configOfCompose = await fetchConfig<BootstrapConfig>(
      fetchComposeUrl,
      {
        timeout: FETCH_CONFIG_TIMEOUT,
      },
      FETCH_CONFIG_RETRIES,
    )

    // if (configOfCompose.warnings) {
    //   configOfCompose.warnings.forEach(({ code, message }) => {
    //     console.warn(`[${code}] ${message}`)
    //   })
    // }
  }

  return mergeConfig(config, configOfCompose)
}

class Processs {
  private readonly _ready: DeferedPromise<boolean>
  private readonly _timers: {
    checkUpdate?: NodeJS.Timeout
  }

  private _session?: any
  private _config?: Config
  private _modules?: Modules
  private _configAsRaw?: BootstrapConfig

  constructor() {
    this._ready = deferedPromise<boolean>()
    this._timers = {
      checkUpdate: undefined,
    }
  }

  private async update() {
    try {
      const config = await transformConfig(this._configAsRaw as BootstrapConfig)

      if (!this._config) {
        throw new Error('The process did not run in sequence')
      }

      this._config.unlock()
      this._config.update(config)
      this._config.lock()
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  public async ready(): Promise<boolean> {
    return this._ready.promise
  }

  public async initial(configAsRaw: BootstrapConfig): Promise<void> {
    this._configAsRaw = ensureConfig(configAsRaw)
    const config = await transformConfig(this._configAsRaw)

    // Set vendors and modules to config, using in modules manager
    this._config = initConfig(config)

    // Lock config, not allow changing any config
    // Note: change config after initialized is dangerous!
    this._config.lock()

    // Init modules manager to using for resolve and more
    initModules()

    // Prepare externals and preload modules if it defined
    this._modules = getModules()
    await Promise.all([this._modules.prepare(), this._modules.ready()])

    // Fired a callback if everything's ok
    this._ready.resolve(true)
  }

  public async checkUpdate(cleanUp?: () => any) {
    if (!this._configAsRaw) {
      throw new Error('The process did not run in sequence')
    }

    if (this._timers.checkUpdate) {
      return
    }

    this._timers.checkUpdate = setTimeout(
      () => (this._timers.checkUpdate = undefined),
      CHECK_UPDATE_TIMEOUT,
    )

    await this.update()
    if (typeof cleanUp === 'function') {
      cleanUp()
    }
  }

  public createSession() {
    this._session = new Set()
  }

  public getSession() {
    return this._session
  }

  public closeSession() {
    this._session = undefined
  }
}

export default Processs
