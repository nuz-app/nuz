import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import { NUZ_DEFAULT_USERNAME } from '../../lib/const'
import print, { info, success } from '../../utils/print'

async function logoutFromUser({
  username: _username,
}: Arguments<{ username: string }>) {
  const isLogoutOther = !!_username
  const currentUser = isLogoutOther && (await Config.whoami())
  if (isLogoutOther) {
    info(`Switching to ${print.name(_username)} account...`)
    await Config.use(_username)
  }

  const auth = await Config.readAuth()
  const { id, username, token } = auth

  if (username === NUZ_DEFAULT_USERNAME) {
    throw new Error('Unable to logout because you use the default profile')
  }

  const request = await Worker.logoutFromUser(id, token)
  info(`Logged out of ${print.name(username)} account`)

  if (isLogoutOther) {
    info(`Switching back to ${print.name((currentUser as any).username)}...`)
    await Config.use((currentUser as any).username)
  } else {
    await Config.use(NUZ_DEFAULT_USERNAME)
  }

  info(`Deleting ${print.name(username)} work folder...`)
  await Config.delete(username)

  success('Done!')
  return true
}

export default logoutFromUser
