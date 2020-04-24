import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function updateCollaborator({
  module: id,
  user,
  type,
}: Arguments<{ module: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.updateCollaboratorOfModule(id, {
    id: user,
    type,
  })

  const moduleId = request?.data?._id
  success(
    `Updated ${print.name(user)} info in module ${print.name(
      moduleId,
    )} successfully!`,
  )
  return true
}

export default updateCollaborator
