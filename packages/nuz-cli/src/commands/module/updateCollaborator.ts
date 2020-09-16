import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ModuleUpdateCollaboratorOptions
  extends Arguments<{
    module: string
    user: string
    type: CollaboratorTypes
  }> {}

async function updateCollaborator(
  options: ModuleUpdateCollaboratorOptions,
): Promise<boolean> {
  const { module: id, user, type } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const request = await Worker.updateCollaboratorOfModule(id, {
    id: user,
    type,
  })
  const moduleId = request?.data?._id

  info(
    `User ${print.name(user)} has been updated in the module ${print.name(
      moduleId,
    )} successfully!`,
  )
  log()

  return true
}

export default updateCollaborator
