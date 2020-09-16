import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { ROOT_USER_DEFAULT_DIRECTORY } from '../../lib/const'
import print, { info, log } from '../../utils/print'

interface UserLogoutFromUserOptions extends Arguments<{ username: string }> {}

async function logoutFromUser(
  options: UserLogoutFromUserOptions,
): Promise<boolean> {
  const { username: selectedUsername } = options

  const isLogoutOther = !!selectedUsername
  const currentUsername = (isLogoutOther &&
    (await Config.whoami()).username) as string
  if (isLogoutOther) {
    info(`Switching to ${print.name(selectedUsername)} account.`)
    log()

    // Switch to the account want to sign out of.
    await Config.use(selectedUsername)
  }

  const { id, username, token } = await Config.readAuthentication()

  // Check if the account is special, it will report an error.
  if (username === ROOT_USER_DEFAULT_DIRECTORY) {
    throw new Error(`Can't sign out of default account.`)
  }

  try {
    // Create a request to perform this action.
    await Worker.logoutFromUser(id, token)
    // tslint:disable-next-line: no-empty
  } catch (error) {}

  info(`Successfully logged out of your ${print.name(username)} account.`)
  log()

  //
  if (isLogoutOther) {
    info(`Switching back to ${print.name(currentUsername)} account.`)
    log()
  }

  // Switch back to the current account or the default account.
  await Config.use(
    isLogoutOther ? currentUsername : ROOT_USER_DEFAULT_DIRECTORY,
  )

  info(`Deleting working directory of ${print.name(username)} account.`)
  log()

  // Delete information about the account just signed out.
  await Config.delete(username)

  return true
}

export default logoutFromUser
