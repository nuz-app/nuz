import { CONFIG_KEY } from '@nuz/shared'

import Config, { ConfigInitial } from '../../classes/Config'
import * as selfHelpers from '../selfHelpers'

export { default as Config } from '../../classes/Config'

export let refConfig = (selfHelpers.get() as any)[CONFIG_KEY]

export const initConfig = (config: ConfigInitial): Config => {
  if (!refConfig) {
    refConfig = new Config(config)
    selfHelpers.set(CONFIG_KEY, refConfig)
  }

  return refConfig
}

const getConfig = (): Config => refConfig

export default getConfig
