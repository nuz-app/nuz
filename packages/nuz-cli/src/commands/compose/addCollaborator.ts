import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

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

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  const request = await Worker.addCollaboratorToCompose(compose, {
    id: user,
    type,
  })
  const composeId = request?.data?._id

  info(
    `Added ${print.name(user)} to compose ${print.name(
      composeId,
    )} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default addCollaborator
