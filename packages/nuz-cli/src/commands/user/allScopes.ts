import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function allScopes() {
  const authentication = await Config.requireAs()

  const tick = timer()
  const request = await Worker.getAllScopesOfUser(authentication.id)
  const scopes = request?.data?.scopes

  info(
    `Scopes list of ${print.name(authentication.username)}, ${print.bold(
      scopes.length,
    )} items`,
  )
  info(pretty(scopes))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default allScopes
