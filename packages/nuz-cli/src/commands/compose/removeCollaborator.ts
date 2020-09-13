import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

interface ComposeRemoveCollaboratorOptions
  extends Arguments<{ compose: string; user: string }> {}

async function removeCollaborator(
  options: ComposeRemoveCollaboratorOptions,
): Promise<boolean> {
  const { compose, user } = options

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  const request = await Worker.removeCollaboratorFromScope(compose, user)
  const composeId = request?.data?._id

  info(
    `Removed ${print.name(user)} from compose ${print.name(
      composeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default removeCollaborator
