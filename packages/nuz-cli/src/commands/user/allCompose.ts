import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function allCompose() {
  const auth = await Config.authRequired()

  const tick = timer()
  const request = await Worker.getAllComposeOfUser(auth.id)
  const composes = request?.data?.composes

  info(
    `Compose list of ${print.name(auth.username)}, ${print.bold(
      composes.length,
    )} items`,
  )
  info(pretty(composes))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default allCompose
