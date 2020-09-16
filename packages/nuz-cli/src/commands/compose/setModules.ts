import { UserAccessTokenTypes } from '@nuz/shared'
import { moduleIdHelpers } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ComposeSetModulesOptions
  extends Arguments<{ compose: string; modules: string[] }> {}

async function setModules(options: ComposeSetModulesOptions): Promise<boolean> {
  const { compose, modules: _modules } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  //
  const modules = _modules.reduce(function (acc, item) {
    const { module: id, version } = moduleIdHelpers.parser(item)

    return Object.assign(acc, { [id]: version })
  }, {})

  // Create a request to perform this action.
  const request = await Worker.setModulesForCompose(compose, modules)
  const composeId = request?.data?._id

  info(`The compose ${print.name(composeId)} set modules`, pretty(modules))
  log()

  return true
}

export default setModules
