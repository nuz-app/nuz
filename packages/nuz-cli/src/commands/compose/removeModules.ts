import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ComposeRemoveModulesOptions
  extends Arguments<{ compose: string; moduleIds: string[] }> {}

async function removeModules(
  options: ComposeRemoveModulesOptions,
): Promise<boolean> {
  const { compose, moduleIds } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.removeModulesForCompose(compose, moduleIds)
  const composeId = request?.data?._id

  info(
    `Modules ${print.dim(
      moduleIds.join(', '),
    )} has been removed from the compose ${print.name(
      composeId,
    )} successfully!`,
  )
  log()

  return true
}

export default removeModules
