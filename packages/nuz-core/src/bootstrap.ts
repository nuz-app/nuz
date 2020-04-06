import { jsonHelpers } from '@nuz/utils'

import { BootstrapConfig, RegistryConfig } from './types'

import Worker from './classes/Worker'

import { mark as markIsInitialized } from './utils/checkIsInitialized'
import getConfig, { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import fetchConfig from './utils/fetchConfig'
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

export let worker

const bootstrap = async (config: BootstrapConfig) => {
  console.log('call bootstrap')

  const configFactory = async () => {
    const configIsInvalid = !validator.bootstrapConfig(config)
    if (configIsInvalid) {
      throw new Error(
        `Bootstrap config is invalid, config: ${jsonHelpers.stringify(config)}`,
      )
    }

    let configOnRegistry

    const registryIsDefined = !!config.registry
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

  worker = new Worker(
    async () => {
      console.log('setup worker - start')
      const receivedConfig = await configFactory()

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
      const receivedConfig = await configFactory()

      const _config = getConfig()
      _config.unlock()
      _config.update(receivedConfig)
      _config.lock()
    },
  )

  await worker.setup()
}

export default bootstrap
