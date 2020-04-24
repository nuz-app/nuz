import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function removeCollaborator({
  scope,
  user,
}: Arguments<{ scope: string; user: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.removeCollaboratorFromScope(scope, user)

  const scopeId = request?.data?._id
  success(
    `Removed ${print.name(user)} from scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  return true
}

export default removeCollaborator
