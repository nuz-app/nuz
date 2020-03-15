import { jsonHelpers } from '@nuz/utils'

import { BootstrapConfig, LiveConfig } from './types'

import bootstrap from './bootstrap'

import getConfig from './utils/getConfig'
import * as validator from './utils/validator'

export interface BootstrapCallbacks {
  render: () => Promise<void>
}

const live = async (
  config: LiveConfig,
  transform: (config: BootstrapConfig) => BootstrapConfig,
  callbacks: BootstrapCallbacks,
) => {
  const configIsInvalid = !validator.liveConfig(config)
  if (configIsInvalid) {
    throw new Error(
      `Live config is invalid, config: ${jsonHelpers.stringify(config)}`,
    )
  }

  const { url, integrity, retries = 1, timeout = -1 } = config

  const liveConfig = await getConfig<BootstrapConfig>(
    url,
    {
      timeout,
      integrity,
    },
    retries,
  )

  const boostrapConfig = transform(liveConfig)
  return bootstrap(boostrapConfig, callbacks)
}

export default live
