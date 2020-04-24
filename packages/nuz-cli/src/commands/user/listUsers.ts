import Config from '../../classes/Config'
import { info, pretty } from '../../utils/print'

async function listUsers() {
  const users = await Config.getUsers()

  info('List users in work folder', pretty(users))
  return true
}

export default listUsers
