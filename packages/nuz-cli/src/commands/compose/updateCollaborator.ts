import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

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

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  const request = await Worker.updateCollaboratorOfCompose(compose, {
    id: user,
    type,
  })
  const composeId = request?.data?._id

  info(
    `Updated ${print.name(user)} info in compose ${print.name(
      composeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default updateCollaborator
