import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'

async function allScopes() {
  const auth = await Config.authRequired()
  const request = await Worker.getAllScopesOfUser(auth.id)
  const scopes = request?.data?.scopes

  info(
    `Scopes list of ${print.name(auth.username)}, ${print.bold(
      scopes.length,
    )} items`,
  )
  info(pretty(scopes))
  success('Done!')
  return true
}

export default allScopes
