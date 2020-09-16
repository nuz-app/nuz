import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

async function allModules(): Promise<boolean> {
  // Check permissions before executing.
  const authentication = await Config.requireAs()

  // Create a request to perform this action.
  const request = await Worker.getAllModulesOfUser(authentication.id)
  const modules = request?.data?.modules

  info(
    `User ${print.name(authentication.username)} are related to ${print.bold(
      modules.length,
    )}  module(s), including...`,
    pretty(modules),
  )
  log()

  return true
}

export default allModules
