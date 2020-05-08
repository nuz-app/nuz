import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function updateCollaborator({
  module: id,
  user,
  type,
}: Arguments<{ module: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.updateCollaboratorOfModule(id, {
    id: user,
    type,
  })

  const moduleId = request?.data?._id
  info(
    `Updated ${print.name(user)} info in module ${print.name(
      moduleId,
    )} successfully!`,
  )
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default updateCollaborator
