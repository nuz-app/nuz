import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ModuleRemoveCollaboratorOptions
  extends Arguments<{ module: string; user: string }> {}

async function removeCollaborator(
  options: ModuleRemoveCollaboratorOptions,
): Promise<boolean> {
  const { module: id, user } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.removeCollaboratorFromModule(id, user)
  const moduleId = request?.data?._id

  info(
    `User ${print.name(user)} has been removed from the module ${print.name(
      moduleId,
    )} successfully!`,
  )
  log()

  return true
}

export default removeCollaborator
