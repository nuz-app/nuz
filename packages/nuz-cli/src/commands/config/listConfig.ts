import Config from '../../classes/Config'

import { info, pretty } from '../../utils/print'

async function listConfig() {
  const config = await Config.readConfig()

  info(pretty(config))
  return true
}

export default listConfig
