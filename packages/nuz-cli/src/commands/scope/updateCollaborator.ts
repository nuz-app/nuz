import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function updateCollaborator({
  scope,
  user,
  type,
}: Arguments<{ scope: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.updateCollaboratorOfScope(scope, {
    id: user,
    type,
  })

  const scopeId = request?.data?._id
  success(
    `Updated ${print.name(user)} info in scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  return true
}

export default updateCollaborator
