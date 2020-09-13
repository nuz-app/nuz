import { UserAccessTokenTypes } from '@nuz/shared'
import { moduleIdHelpers } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

interface ComposeSetModulesOptions
  extends Arguments<{ compose: string; modules: string[] }> {}

async function setModules(options: ComposeSetModulesOptions): Promise<boolean> {
  const { compose, modules: _modules } = options

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  //
  const modules = _modules.reduce(function (acc, item) {
    const { module: id, version } = moduleIdHelpers.parser(item)

    return Object.assign(acc, { [id]: version })
  }, {})

  const tick = timer()

  //
  const request = await Worker.setModulesForCompose(compose, modules)
  const composeId = request?.data?._id

  info('Compose id', print.name(composeId))
  info(pretty(modules))
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default setModules
