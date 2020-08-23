import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeCollaborator({
  module: id,
  user,
}: Arguments<{ module: string; user: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeCollaboratorFromModule(id, user)

  const moduleId = request?.data?._id
  info(
    `Removed ${print.name(user)} from module ${print.name(
      moduleId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default removeCollaborator
