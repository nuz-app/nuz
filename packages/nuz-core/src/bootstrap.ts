import { jsonHelpers } from '@nuz/utils'

import { BootstrapConfig, EventTypes } from './types'

import { emitter } from './events'

import checkIsFunction from './utils/checkIsFunction'
import { mark as markIsInitialized } from './utils/checkIsInitialized'
import { initConfig } from './utils/effects/getConfig'
import getModules, { initModules } from './utils/effects/getModules'
import * as validator from './utils/validator'

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

  const {
    preload,
    linked: definedLinked,
    vendors: definedVendors,
    modules: definedModules,
  } = config

  console.log({ config })
  // Set vendors and modules to config, using in modules manager
  initConfig({
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

  // Preload resource if `preload` field is provided
  if (preload) {
    await modules.preload(preload)
  }

  // Emit a ready event
  emitter.emit(EventTypes.ready)

  if (checkIsFunction(callbacks.render)) {
    await callbacks.render()
  }

  return true
}

export default bootstrap
