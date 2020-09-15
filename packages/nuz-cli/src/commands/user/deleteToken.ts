import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

interface UserDeleteTokenOptions extends Arguments<{ token: string }> {}

async function deleteToken(options: UserDeleteTokenOptions): Promise<boolean> {
  const { token } = options

  // Check permissions before executing
  const authentication = await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  await Worker.deleteTokenFromUser(authentication.id, token)

  info(
    `Successfully deleted token ${print.dim(token)} from ${print.name(
      authentication.username,
    )} account`,
  )
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default deleteToken
