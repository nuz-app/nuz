import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ModuleAddCollaboratorOptions
  extends Arguments<{
    module: string
    user: string
    type: CollaboratorTypes
  }> {}

async function addCollaborator(
  options: ModuleAddCollaboratorOptions,
): Promise<boolean> {
  const { module: id, user, type } = Object.assign(
    { type: CollaboratorTypes.contributor },
    options,
  )

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.addCollaboratorToModule(id, {
    id: user,
    type,
  })
  const moduleId = request?.data?._id

  info(
    `User ${print.name(user)} has been added to the module ${print.name(
      moduleId,
    )} successfully!`,
  )
  log()

  return true
}

export default addCollaborator
