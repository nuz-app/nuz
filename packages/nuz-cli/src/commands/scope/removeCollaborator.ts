import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ScopeRemoveCollaboratorOptions
  extends Arguments<{ scope: string; user: string }> {}

async function removeCollaborator(
  options: ScopeRemoveCollaboratorOptions,
): Promise<boolean> {
  const { scope, user } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.removeCollaboratorFromScope(scope, user)
  const scopeId = request?.data?._id

  info(
    `User ${print.name(user)} has been removed from the scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  log()

  return true
}

export default removeCollaborator
