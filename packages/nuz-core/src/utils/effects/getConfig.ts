import { BootstrapConfig } from '../../types'

import { CONFIG as CONFIG_KEY } from '../../lib/symbols'

import Config from '../../classes/Config'
import * as selfHelpers from '../selfHelpers'

export { default as Config } from '../../classes/Config'

export let refConfig = selfHelpers.get()[CONFIG_KEY]

export const initConfig = (
  config?: Pick<BootstrapConfig, 'linked' | 'vendors' | 'modules'>,
) => {
  if (!refConfig) {
    refConfig = new Config(config)
    selfHelpers.set(CONFIG_KEY, refConfig)
  }
}

const getConfig = (): Config => refConfig

export default getConfig
