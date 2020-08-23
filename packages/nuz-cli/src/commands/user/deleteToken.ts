import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function deleteToken({ token }: Arguments<{ token: string }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  await Worker.deleteTokenFromUser(auth.id, token)

  info(
    `Successfully deleted token ${print.dim(token)} from ${print.name(
      auth.username,
    )} account`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default deleteToken
