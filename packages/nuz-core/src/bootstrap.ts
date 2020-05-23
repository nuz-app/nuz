import { NUZ_REGISTRY_URL, SHARED_CONFIG_KEY } from '@nuz/shared'
import { checkIsObject, ensureOrigin, getConfigUrl } from '@nuz/utils'

import { BootstrapConfig, RuntimePlatforms } from './types'

import Worker from './classes/Worker'

import { mark as markIsInitialized } from './utils/checkIsInitialized'
import getConfig, { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import fetchConfig from './utils/fetchConfig'
import getRuntimePlatform from './utils/getRuntimePlatform'
import uniq from './utils/uniq'

import * as waitToReady from './waitToReady'

const mergeConfig = (
  localConfig: BootstrapConfig,
  { modules, preload }: BootstrapConfig = {},
): BootstrapConfig =>
  Object.assign({}, localConfig, {
    preload: uniq(preload, localConfig.preload),
    modules: Object.assign({}, modules, localConfig.modules),
  })

const configFactory = async (config: BootstrapConfig) => {
  if (!config) {
    throw new Error(`Config bootstrap is required`)
  }

  const registryUrl = ensureOrigin(
    config?.registry || NUZ_REGISTRY_URL,
  ) as string

  const isNode = getRuntimePlatform() === RuntimePlatforms.node
  const composeIsDefined = !!config.compose
  const sharedIsValid =
    !isNode && composeIsDefined && checkIsObject(window[SHARED_CONFIG_KEY])

  let configOfCompose = !sharedIsValid
    ? undefined
    : (window[SHARED_CONFIG_KEY] as BootstrapConfig)

  if (composeIsDefined && !configOfCompose) {
    const configUrl = getConfigUrl(config.compose as string, registryUrl)

    configOfCompose = await fetchConfig<BootstrapConfig>(
      configUrl,
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

export let worker

const bootstrap = async (config: BootstrapConfig) => {
  worker = new Worker(
    async () => {
      const receivedConfig = await configFactory(config)

      // Set vendors and modules to config, using in modules manager
      const _config = initConfig(receivedConfig)
      markIsInitialized()

      // Init modules manager to using for resolve and more
      initModules()

      // Prepare externals and preload modules if it defined
      const modules = getModules()
      await Promise.all([modules.prepare(), modules.ready()])

      // Lock config, not allow changing any config
      // Note: change config after initialized is dangerous!
      _config.lock()

      // Fire a callback if everything's ok
      waitToReady.ok()

      return true
    },
    async () => {
      //
    },
    async () => {
      const receivedConfig = await configFactory(config)

      const _config = getConfig()
      _config.unlock()
      _config.update(receivedConfig)
      _config.lock()
    },
  )

  await worker.setup()

  return worker
}

export default bootstrap
