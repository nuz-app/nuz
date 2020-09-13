import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeCollaborator({
  scope,
  user,
}: Arguments<{ scope: string; user: string }>) {
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeCollaboratorFromScope(scope, user)

  const scopeId = request?.data?._id
  info(
    `Removed ${print.name(user)} from scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default removeCollaborator
