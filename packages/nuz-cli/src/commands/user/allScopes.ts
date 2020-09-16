import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

async function allScopes(): Promise<boolean> {
  // Check permissions before executing.
  const authentication = await Config.requireAs()

  // Create a request to perform this action.
  const request = await Worker.getAllScopesOfUser(authentication.id)
  const scopes = request?.data?.scopes

  info(
    `User ${print.name(authentication.username)} are related to ${print.bold(
      scopes.length,
    )}  scope(s), including...`,
    pretty(scopes),
  )
  log()

  return true
}

export default allScopes
