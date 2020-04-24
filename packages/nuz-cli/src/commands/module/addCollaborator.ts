import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function addCollaborator({
  module: id,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ module: string; user: string; type: CollaboratorTypes }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.addCollaboratorToModule(auth.token, id, {
    id: user,
    type,
  })

  const moduleId = request?.data?._id
  success(
    `Added ${print.name(user)} to module ${print.name(moduleId)} successfully!`,
  )
  return true
}

export default addCollaborator
