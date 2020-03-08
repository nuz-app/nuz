import _merge from 'lodash/merge'

import { BootstrapConfig, UpstreamConfig } from './types'

import bootstrap from './bootstrap'

import { FetchOptions } from './utils/fetchWithTimeout'
import getUpstreamConfig from './utils/getUpstreamConfig'
import * as jsonHelpers from './utils/jsonHelpers'
import * as validator from './utils/validator'

export interface BootstrapCallbacks {
  render: () => Promise<void>
}

const tryGetConfig = async (
  url: string,
  retries: number,
  config: FetchOptions,
) => {
  let result

  try {
    result = await getUpstreamConfig(url, config)
  } catch (error) {
    if (retries <= 0) {
      throw error
    }

    result = await tryGetConfig(url, retries - 1, config)
  }

  if (!result) {
    throw new Error(
      `Config is not found from url, url: ${jsonHelpers.stringify(url)}`,
    )
  }

  return result
}

const upstream = async (
  config: UpstreamConfig,
  trasnformConfig: (config: BootstrapConfig) => BootstrapConfig,
  callbacks: BootstrapCallbacks,
) => {
  const configIsInvalid = !validator.upstreamConfig(config)
  if (configIsInvalid) {
    throw new Error(
      `Upstream config is invalid, config: ${jsonHelpers.stringify(config)}`,
    )
  }

  const { url, integrity, retries = 1, timeout = -1 } = config

  const upstreamConfig = await tryGetConfig(url, retries, {
    timeout,
    integrity,
  })

  const transformedBoostrap = trasnformConfig(upstreamConfig)
  return bootstrap(transformedBoostrap, callbacks)
}

export default upstream
