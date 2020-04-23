import Config from '../../classes/Config'

import { pretty, success } from '../../utils/print'

async function listConfig() {
  const config = await Config.readConfig()

  success(pretty(config))
  return true
}

export default listConfig
