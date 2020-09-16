import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ModuleSetDeprecateOptions
  extends Arguments<{
    module: string
    versions: string
    deprecate: string | undefined
  }> {}

async function setDeprecate(
  options: ModuleSetDeprecateOptions,
): Promise<boolean> {
  const { module: id, versions, deprecate } = options

  if (!id || !versions) {
    throw new Error('Missing information to set deprecate for the module.')
  }

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.setDeprecateForModule(id, versions, deprecate)
  const moduleId = request?.data?._id
  const versionsUpdated = request?.data?.versions

  const isDeprecated = !!deprecate
  info(
    `Update module ${print.name(moduleId)} with affected versions ${print.blue(
      versionsUpdated.join(', '),
    )}.`,
  )
  info.apply(
    info,
    isDeprecated
      ? ['Deprecated message', print.yellow(deprecate)]
      : ['Deprecate was removed'],
  )
  log()

  return true
}

export default setDeprecate
