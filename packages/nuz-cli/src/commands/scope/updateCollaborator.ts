import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ScopeUpdateCollaboratorOptions
  extends Arguments<{ scope: string; user: string; type: CollaboratorTypes }> {}

async function updateCollaborator(
  options: ScopeUpdateCollaboratorOptions,
): Promise<boolean> {
  const { scope, user, type } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.updateCollaboratorOfScope(scope, {
    id: user,
    type,
  })
  const scopeId = request?.data?._id

  info(
    `User ${print.name(user)} has been updated in the scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  log()

  return true
}

export default updateCollaborator
