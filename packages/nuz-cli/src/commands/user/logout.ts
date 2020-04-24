import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import { NUZ_DEFAULT_USERNAME } from '../../lib/const'
import print, { success } from '../../utils/print'

async function logout() {
  const auth = await Config.readAuth()
  const { id, username, token } = auth

  if (username === NUZ_DEFAULT_USERNAME) {
    throw new Error('Unable to logout because you use the default profile')
  }

  const request = await Worker.logout(id, token)

  await Config.use(NUZ_DEFAULT_USERNAME)
  await Config.delete(username)

  success(`Logged out of ${print.bold(username)} account`)
  return true
}

export default logout
