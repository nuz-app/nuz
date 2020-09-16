import Config from '../../classes/Config'
import { info, log, pretty } from '../../utils/print'

async function listConfig(): Promise<boolean> {
  const configuration = await Config.readConfiguration()

  //
  info('Full configuration information', pretty(configuration))
  log()

  return true
}

export default listConfig
