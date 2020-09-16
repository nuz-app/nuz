import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ScopeAddCollaboratorOptions
  extends Arguments<{ scope: string; user: string; type: CollaboratorTypes }> {}

async function addCollaborator(
  options: ScopeAddCollaboratorOptions,
): Promise<boolean> {
  const { scope, user, type } = Object.assign(
    { type: CollaboratorTypes.contributor },
    options,
  )

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.addCollaboratorToScope(scope, {
    id: user,
    type,
  })
  const scopeId = request?.data?._id

  info(
    `User ${print.name(user)} has been added to the scope ${print.name(
      scopeId,
    )} successfully!`,
  )
  log()

  return true
}

export default addCollaborator
