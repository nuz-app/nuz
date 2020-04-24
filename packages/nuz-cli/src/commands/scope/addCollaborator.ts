import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function addCollaborator({
  scope,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ scope: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.addCollaboratorToScope(scope, {
    id: user,
    type,
  })

  const scopeId = request?.data?._id
  success(
    `Added ${print.name(user)} to scope ${print.name(scopeId)} successfully!`,
  )
  return true
}

export default addCollaborator
