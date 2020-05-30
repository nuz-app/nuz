import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function updateCollaborator({
  scope,
  user,
  type,
}: Arguments<{ scope: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.updateCollaboratorOfScope(scope, {
    id: user,
    type,
  })

  const scopeId = request?.data?._id
  info(
    `Updated ${print.name(user)} info in scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default updateCollaborator
