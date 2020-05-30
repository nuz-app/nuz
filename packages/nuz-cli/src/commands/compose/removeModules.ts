import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeModules({
  compose,
  moduleIds,
}: Arguments<{ compose: string; moduleIds: string[] }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeModulesForCompose(compose, moduleIds)
  const composeId = request?.data?._id

  info('Compose id', print.name(composeId))
  info('Removed modules', print.dim(moduleIds.join(', ')))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default removeModules
