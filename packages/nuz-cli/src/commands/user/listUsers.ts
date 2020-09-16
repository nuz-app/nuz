import Config from '../../classes/Config'
import { info, log, pretty } from '../../utils/print'

async function listUsers(): Promise<boolean> {
  //
  const users = await Config.getUsersLogged()

  info('List of available users', pretty(users))
  log()

  return true
}

export default listUsers
