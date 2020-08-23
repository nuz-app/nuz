import { CONFIG_KEY } from '@nuz/shared'

import Config, { ConfigInitial } from '../../classes/Config'
import * as selfHelpers from '../selfHelpers'
export { default as Config } from '../../classes/Config'

let referenceConfig = (selfHelpers.get() as any)[CONFIG_KEY]

export function initializeConfig(initial: ConfigInitial): Config {
  if (!referenceConfig) {
    referenceConfig = new Config(initial)
    selfHelpers.set(CONFIG_KEY, referenceConfig)
  }

  return referenceConfig
}

function getConfig(): Config {
  return referenceConfig
}

export default getConfig
