import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function allModules(): Promise<boolean> {
  // Check permissions before executing
  const authentication = await Config.requireAs()

  const tick = timer()

  //
  const request = await Worker.getAllModulesOfUser(authentication.id)
  const modules = request?.data?.modules

  info(
    `Modules list of ${print.name(authentication.username)}, ${print.bold(
      modules.length,
    )} items`,
  )
  info(pretty(modules))
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default allModules
