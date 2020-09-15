import Config from '../../classes/Config'
import { info, pretty } from '../../utils/print'

async function listUsers(): Promise<boolean> {
  //
  const users = await Config.getUsersLogged()

  info('List users in work folder', pretty(users))

  return true
}

export default listUsers
