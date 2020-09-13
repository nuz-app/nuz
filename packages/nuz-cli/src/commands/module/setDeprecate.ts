import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function setDeprecate({
  module: id,
  versions,
  deprecate,
}: Arguments<{
  module: string
  versions: string
  deprecate: string | undefined
}>) {
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  if (!id || !versions) {
    throw new Error('Id or versions is invalid')
  }

  const tick = timer()
  const request = await Worker.setDeprecateForModule(id, versions, deprecate)
  const moduleId = request?.data?._id
  const versionsUpdated = request?.data?.versions

  const isDeprecated = !!deprecate
  info('Module id', print.name(moduleId))
  info('Impact versions', print.blue(versionsUpdated.join(', ')))
  if (isDeprecated) {
    info('Message', print.yellow(deprecate))
  } else {
    info('Deprecate removed!')
  }

  success(`Done in ${print.time(tick())}.`)
  return true
}

export default setDeprecate
