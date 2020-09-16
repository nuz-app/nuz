import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ComposeAddCollaboratorOptions
  extends Arguments<{
    compose: string
    user: string
    type: CollaboratorTypes
  }> {}

async function addCollaborator(
  options: ComposeAddCollaboratorOptions,
): Promise<boolean> {
  const { compose, user, type } = Object.assign(
    { type: CollaboratorTypes.contributor },
    options,
  )

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.addCollaboratorToCompose(compose, {
    id: user,
    type,
  })
  const composeId = request?.data?._id

  info(
    `User ${print.name(user)} has been added to the compose ${print.name(
      composeId,
    )} successfully!`,
  )
  log()

  return true
}

export default addCollaborator
