import { CollaboratorTypes, UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function addCollaborator({
  scope,
  user,
  type = CollaboratorTypes.contributor,
}: Arguments<{ scope: string; user: string; type: CollaboratorTypes }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.addCollaboratorToScope(scope, {
    id: user,
    type,
  })

  const scopeId = request?.data?._id
  info(
    `Added ${print.name(user)} to scope ${print.name(scopeId)} successfully!`,
  )
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default addCollaborator
