import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function addCollaborator({
  compose,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ compose: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
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
