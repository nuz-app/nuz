import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function updateCollaborator({
  composition,
  user,
  type,
}: Arguments<{ composition: string; user: string; type: CollaboratorTypes }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.updateCollaboratorOfComposition(
    auth.token,
    composition,
    {
      id: user,
      type,
    },
  )

  const compositionId = request?.data?._id
  success(
    `Updated ${print.name(user)} info in composition ${print.name(
      compositionId,
    )} successfully!`,
  )
  return true
}

export default updateCollaborator
