import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function removeCollaborator({
  module: id,
  user,
}: Arguments<{ module: string; user: string }>) {
  const auth = await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.removeCollaboratorFromModule(
    auth.token,
    id,
    user,
  )

  const moduleId = request?.data?._id
  success(
    `Removed ${print.name(user)} from module ${print.name(
      moduleId,
    )} successfully!`,
  )
  return true
}

export default removeCollaborator
