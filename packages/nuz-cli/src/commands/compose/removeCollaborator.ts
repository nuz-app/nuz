import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ComposeRemoveCollaboratorOptions
  extends Arguments<{ compose: string; user: string }> {}

async function removeCollaborator(
  options: ComposeRemoveCollaboratorOptions,
): Promise<boolean> {
  const { compose, user } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.removeCollaboratorFromScope(compose, user)
  const composeId = request?.data?._id

  info(
    `User ${print.name(user)} has been removed from the compose ${print.name(
      composeId,
    )} successfully!`,
  )
  log()

  return true
}

export default removeCollaborator
