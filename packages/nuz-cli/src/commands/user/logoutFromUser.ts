import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { ROOT_USER_DEFAULT_DIRECTORY } from '../../lib/const'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function logoutFromUser({
  username: _username,
}: Arguments<{ username: string }>) {
  const isLogoutOther = !!_username
  const currentUser = isLogoutOther && (await Config.whoami())
  if (isLogoutOther) {
    info(`Switching to ${print.name(_username)} account...`)
    await Config.use(_username)
  }

  const authentication = await Config.readAuthentication()
  const { id, username, token } = authentication

  if (username === ROOT_USER_DEFAULT_DIRECTORY) {
    throw new Error('Unable to logout because you use the default profile')
  }

  const tick = timer()
  await Worker.logoutFromUser(id, token)
  info(`Logged out of ${print.name(username)} account`)

  if (isLogoutOther) {
    info(`Switching back to ${print.name((currentUser as any).username)}...`)
    await Config.use((currentUser as any).username)
  } else {
    await Config.use(ROOT_USER_DEFAULT_DIRECTORY)
  }

  info(`Deleting ${print.name(username)} work folder...`)
  await Config.delete(username)

  success(`Done in ${print.time(tick())}.`)
  return true
}

export default logoutFromUser
