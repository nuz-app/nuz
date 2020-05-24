import { NUZ_REGISTRY_URL, SHARED_CONFIG_KEY } from '@nuz/shared'
import { checkIsObject, ensureOrigin, getFetchUrls } from '@nuz/utils'

import { BootstrapConfig, RuntimePlatforms } from './types'

import Worker from './classes/Worker'

import { mark as markIsInitialized } from './utils/checkIsInitialized'
import getConfig, { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import fetchConfig from './utils/fetchConfig'
import getRuntimePlatform from './utils/getRuntimePlatform'
import uniq from './utils/uniq'

import * as waitToReady from './waitToReady'

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
    ...config,
    registry: config.registry || NUZ_REGISTRY_URL,
    ssr: typeof config.ssr === 'boolean' ? config.ssr : false,
    global: typeof config.global === 'boolean' ? config.global : true,
  }
}

async function configFactory(config: BootstrapConfig) {
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
        timeout: 10000,
      },
      1,
    )

    if (configOfCompose.warnings) {
      configOfCompose.warnings.forEach(({ code, message }) => {
        console.warn(`[${code}] ${message}`)
      })
    }
  }

  return mergeConfig(config, configOfCompose)
}

const RELOAD_CONFIG_TIMEOUT = 5000

export let worker

async function bootstrap(_config: BootstrapConfig) {
  if (!_config) {
    throw new Error(`Config bootstrap is required`)
  }

  const config = ensureConfig(_config)
  let timeoutId

  worker = new Worker(
    async () => {
      const receivedConfig = await configFactory(config)

      // Set vendors and modules to config, using in modules manager
      const configWorker = initConfig(receivedConfig)
      markIsInitialized()

      // Init modules manager to using for resolve and more
      initModules()

      // Prepare externals and preload modules if it defined
      const modules = getModules()
      await Promise.all([modules.prepare(), modules.ready()])

      // Lock config, not allow changing any config
      // Note: change config after initialized is dangerous!
      configWorker.lock()

      // Fire a callback if everything's ok
      waitToReady.ok()

      return true
    },
    // tslint:disable-next-line: no-empty
    async () => {},
    async () => {
      if (timeoutId) {
        return false
      }

      timeoutId = setTimeout(
        () => (timeoutId = undefined),
        RELOAD_CONFIG_TIMEOUT,
      )

      try {
        const receivedConfig = await configFactory(config)

        const configWorker = getConfig()
        configWorker.unlock()
        configWorker.update(receivedConfig)
        configWorker.lock()
        // tslint:disable-next-line: no-empty
      } catch {}
    },
  )

  await worker.setup()

  return worker
}

export default bootstrap
