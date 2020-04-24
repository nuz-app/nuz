import Config, { AuthKeys } from '../../classes/Config'
import { pretty, success } from '../../utils/print'

async function list() {
  const users = await Config.getUsers()

  success('List users in work folder', pretty(users))
  return true
}

export default list
