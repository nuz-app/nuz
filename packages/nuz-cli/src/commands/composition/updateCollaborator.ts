import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function updateCollaborator({
  composition,
  user,
  type,
}: Arguments<{ composition: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.updateCollaboratorOfComposition(composition, {
    id: user,
    type,
  })

  const compositionId = request?.data?._id
  info(
    `Updated ${print.name(user)} info in composition ${print.name(
      compositionId,
    )} successfully!`,
  )
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default updateCollaborator
