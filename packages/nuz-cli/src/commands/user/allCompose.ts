import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function allCompose(): Promise<boolean> {
  // Check permissions before executing
  const authentication = await Config.requireAs()

  const tick = timer()

  //
  const request = await Worker.getAllComposeOfUser(authentication.id)
  const composes = request?.data?.composes

  info(
    `Compose list of ${print.name(authentication.username)}, ${print.bold(
      composes.length,
    )} items`,
  )
  info(pretty(composes))
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default allCompose
