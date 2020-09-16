import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ComposeUpdateCollaboratorOptions
  extends Arguments<{
    compose: string
    user: string
    type: CollaboratorTypes
  }> {}

async function updateCollaborator(
  options: ComposeUpdateCollaboratorOptions,
): Promise<boolean> {
  const { compose, user, type } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.updateCollaboratorOfCompose(compose, {
    id: user,
    type,
  })
  const composeId = request?.data?._id

  info(
    `User ${print.name(user)} has been updated in the compose ${print.name(
      composeId,
    )} successfully!`,
  )
  log()

  return true
}

export default updateCollaborator
