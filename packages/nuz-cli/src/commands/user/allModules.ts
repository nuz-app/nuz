import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function allModules() {
  const auth = await Config.authRequired()

  const tick = timer()
  const request = await Worker.getAllModulesOfUser(auth.id)
  const modules = request?.data?.modules

  info(
    `Modules list of ${print.name(auth.username)}, ${print.bold(
      modules.length,
    )} items`,
  )
  info(pretty(modules))
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default allModules
