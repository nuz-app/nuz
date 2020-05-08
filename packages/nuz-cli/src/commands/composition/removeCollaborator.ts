import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeCollaborator({
  composition,
  user,
}: Arguments<{ composition: string; user: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeCollaboratorFromScope(composition, user)

  const compositionId = request?.data?._id
  info(
    `Removed ${print.name(user)} from composition ${print.name(
      compositionId,
    )} successfully!`,
  )
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default removeCollaborator
