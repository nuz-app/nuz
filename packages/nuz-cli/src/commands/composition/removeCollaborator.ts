import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function removeCollaborator({
  composition,
  user,
}: Arguments<{ composition: string; user: string }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.removeCollaboratorFromScope(
    auth.token,
    composition,
    user,
  )

  const compositionId = request?.data?._id
  success(
    `Removed ${print.name(user)} from composition ${print.name(
      compositionId,
    )} successfully!`,
  )
  return true
}

export default removeCollaborator
