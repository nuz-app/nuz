import Config from '../../classes/Config'
import { pretty, info } from '../../utils/print'

async function list() {
  const users = await Config.getUsers()

  info('List users in work folder', pretty(users))
  return true
}

export default list
