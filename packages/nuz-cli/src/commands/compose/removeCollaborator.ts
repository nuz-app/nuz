import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeCollaborator({
  compose,
  user,
}: Arguments<{ compose: string; user: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeCollaboratorFromScope(compose, user)

  const composeId = request?.data?._id
  info(
    `Removed ${print.name(user)} from compose ${print.name(
      composeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default removeCollaborator
