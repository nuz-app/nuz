import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ModuleSetTagOptions
  extends Arguments<{
    module: string
    version: string
    tag: string
  }> {}

async function setTag(options: ModuleSetTagOptions): Promise<boolean> {
  const { module: id, version, tag } = options

  if (!id || !version || !tag) {
    throw new Error('Missing information to set tag for the module.')
  }

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.setTagForModule(id, version, tag)
  const moduleId = request?.data?._id
  const versionUpdated = request?.data?.version

  info(
    `Update module ${print.name(moduleId)} with tag ${print.blue(
      tag,
    )} is ${print.blue(versionUpdated)}.`,
  )
  log()

  return true
}

export default setTag
