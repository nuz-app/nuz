import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function addCollaborator({
  module: id,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ module: string; user: string; type: CollaboratorTypes }>) {
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.addCollaboratorToModule(id, {
    id: user,
    type,
  })

  const moduleId = request?.data?._id
  info(
    `Added ${print.name(user)} to module ${print.name(moduleId)} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default addCollaborator
