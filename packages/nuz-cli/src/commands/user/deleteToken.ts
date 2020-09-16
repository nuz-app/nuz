import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface UserDeleteTokenOptions extends Arguments<{ token: string }> {}

async function deleteToken(options: UserDeleteTokenOptions): Promise<boolean> {
  const { token } = options

  // Check permissions before executing.
  const authentication = await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  await Worker.deleteTokenFromUser(authentication.id, token)

  info(
    `Token ${print.dim(token)} of user ${print.name(
      authentication.username,
    )} has been successfully deleted.`,
  )
  log()

  return true
}

export default deleteToken
