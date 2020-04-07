import { SHARED_CONFIG_KEY } from '@nuz/shared'
import { checkIsObject, jsonHelpers } from '@nuz/utils'

import { BootstrapConfig, RegistryConfig, RuntimePlatforms } from './types'

import Worker from './classes/Worker'

import { mark as markIsInitialized } from './utils/checkIsInitialized'
import getConfig, { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import fetchConfig from './utils/fetchConfig'
import getRuntimePlatform from './utils/getRuntimePlatform'
import uniq from './utils/uniq'
import * as validator from './utils/validator'

const mergeConfig = (
  localConfig: BootstrapConfig,
  { modules, preload }: BootstrapConfig = {},
): BootstrapConfig =>
  Object.assign({}, localConfig, {
    preload: uniq(preload, localConfig.preload),
    modules: Object.assign({}, modules, localConfig.modules),
  })

const configFactory = async (config: BootstrapConfig) => {
  const configIsInvalid = !validator.bootstrapConfig(config)
  if (configIsInvalid) {
    throw new Error(
      `Bootstrap config is invalid, config: ${jsonHelpers.stringify(config)}`,
    )
  }

  const isNode = getRuntimePlatform() === RuntimePlatforms.node
  const registryIsDefined = !!config.registry
  const sharedIsValid =
    !isNode && registryIsDefined && checkIsObject(window[SHARED_CONFIG_KEY])

  let configOnRegistry = !sharedIsValid
    ? undefined
    : (window[SHARED_CONFIG_KEY] as BootstrapConfig)

  if (registryIsDefined && !configOnRegistry) {
    const registryConfig = (config.registry || {}) as RegistryConfig
    const registryUrl =
      typeof config.registry === 'string'
        ? config.registry
        : (config.registry as any).url

    configOnRegistry = await fetchConfig<BootstrapConfig>(
      registryUrl,
      {
        timeout: registryConfig.timeout || -1,
        integrity: registryConfig.integrity || '',
      },
      registryConfig.retries || 1,
    )
  }

  return mergeConfig(config, configOnRegistry)
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
      await modules.prepare()

      // Lock config, not allow changing any config
      // Note: change config after initialized is dangerous!
      _config.lock()

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
}

export default bootstrap
