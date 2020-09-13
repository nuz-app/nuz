import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

interface ComposeRemoveModulesOptions
  extends Arguments<{ compose: string; moduleIds: string[] }> {}

async function removeModules(
  options: ComposeRemoveModulesOptions,
): Promise<boolean> {
  const { compose, moduleIds } = options

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  const request = await Worker.removeModulesForCompose(compose, moduleIds)
  const composeId = request?.data?._id

  info('Compose id', print.name(composeId))
  info('Removed modules', print.dim(moduleIds.join(', ')))
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default removeModules
