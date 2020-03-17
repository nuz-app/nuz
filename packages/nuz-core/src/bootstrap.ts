import { jsonHelpers } from '@nuz/utils'

import { BootstrapConfig, EventTypes, RegistryConfig } from './types'

import { emitter } from './events'

import checkIsFunction from './utils/checkIsFunction'
import { mark as markIsInitialized } from './utils/checkIsInitialized'
import { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import getConfig from './utils/getConfig'
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

export interface BootstrapCallbacks {
  render: () => Promise<void>
}

const defaultCallbacks = {} as BootstrapCallbacks

const bootstrap = async (
  config: BootstrapConfig,
  callbacks: BootstrapCallbacks = defaultCallbacks,
) => {
  const configIsInvalid = !validator.bootstrapConfig(config)
  if (configIsInvalid) {
    throw new Error(
      `Bootstrap config is invalid, config: ${jsonHelpers.stringify(config)}`,
    )
  }

  let configOnRegistry
  const registryIsDefined = !!config.registry
  if (registryIsDefined) {
    const registryConfig = (config.registry || {}) as RegistryConfig
    const registryUrl =
      typeof config.registry === 'string'
        ? config.registry
        : config.registry.url

    configOnRegistry = await getConfig<BootstrapConfig>(
      registryUrl,
      {
        timeout: registryConfig.timeout || -1,
        integrity: registryConfig.integrity || '',
      },
      registryConfig.retries || 1,
    )
  }

  const {
    dev,
    preload,
    linked: definedLinked,
    vendors: definedVendors,
    modules: definedModules,
  } = mergeConfig(config, configOnRegistry)

  // Set vendors and modules to config, using in modules manager
  initConfig({
    dev,
    preload,
    linked: definedLinked,
    vendors: definedVendors,
    modules: definedModules,
  })
  markIsInitialized()

  // Emit an initial event
  emitter.emit(EventTypes.initial)

  // Init modules manager to using for resolve and more
  initModules()

  // Prepare externals and preload modules if it defined
  const modules = getModules()
  await modules.prepare()

  // Emit a ready event
  emitter.emit(EventTypes.ready)

  if (checkIsFunction(callbacks.render)) {
    await callbacks.render()
  }

  return true
}

export default bootstrap
