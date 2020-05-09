import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function removeModules({
  composition,
  moduleIds,
}: Arguments<{ composition: string; moduleIds: string[] }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.removeModulesForComposition(
    composition,
    moduleIds,
  )
  const compositionId = request?.data?._id

  info('Composition id', print.name(compositionId))
  info('Removed modules', print.dim(moduleIds.join(', ')))
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default removeModules