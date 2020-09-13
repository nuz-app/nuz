import Config from '../../classes/Config'
import { info, pretty } from '../../utils/print'

async function listConfig(): Promise<boolean> {
  const configuration = await Config.readConfiguration()

  //
  info(pretty(configuration))

  return true
}

export default listConfig
