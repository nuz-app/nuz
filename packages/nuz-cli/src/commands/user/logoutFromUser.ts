import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { ROOT_USER_DEFAULT_DIRECTORY } from '../../lib/const'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

interface UserLogoutFromUserOptions extends Arguments<{ username: string }> {}

async function logoutFromUser(
  options: UserLogoutFromUserOptions,
): Promise<boolean> {
  const { username: selectedUsername } = options

  const isLogoutOther = !!selectedUsername
  const currentUsername = (isLogoutOther &&
    (await Config.whoami()).username) as string
  if (isLogoutOther) {
    info(`Switching to ${print.name(selectedUsername)} account...`)

    // Switch to the account want to sign out of.
    await Config.use(selectedUsername)
  }

  const { id, username, token } = await Config.readAuthentication()

  // Check if the account is special, it will report an error.
  if (username === ROOT_USER_DEFAULT_DIRECTORY) {
    throw new Error(`Can't log out because this is the default account.`)
  }

  const tick = timer()

  // Proceed to log out of your account
  try {
    await Worker.logoutFromUser(id, token)
    // tslint:disable-next-line: no-empty
  } catch (error) {}

  info(`Logged out of ${print.name(username)} account`)
  if (isLogoutOther) {
    info(`Switching back to ${print.name(currentUsername)}...`)
  }

  // Switch back to the current account or the default account
  await Config.use(
    isLogoutOther ? currentUsername : ROOT_USER_DEFAULT_DIRECTORY,
  )

  info(`Deleting ${print.name(username)} work folder...`)

  // Delete information about the account just signed out
  await Config.delete(username)

  success(`Done in ${print.time(tick())}.`)

  return true
}

export default logoutFromUser
