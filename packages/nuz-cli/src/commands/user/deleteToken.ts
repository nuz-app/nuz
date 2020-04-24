import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function deleteToken({ token }: Arguments<{ token: string }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.deleteTokenFromUser(auth.id, token)

  success(
    `Successfully deleted token ${print.dim(token)} from ${print.name(
      auth.username,
    )} account`,
  )

  return true
}

export default deleteToken
