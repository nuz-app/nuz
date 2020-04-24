import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function addCollaborator({
  composition,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ composition: string; user: string; type: CollaboratorTypes }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.addCollaboratorToComposition(
    auth.token,
    composition,
    {
      id: user,
      type,
    },
  )

  const compositionId = request?.data?._id
  success(
    `Added ${print.name(user)} to composition ${print.name(
      compositionId,
    )} successfully!`,
  )
  return true
}

export default addCollaborator
