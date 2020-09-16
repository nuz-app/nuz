import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

async function allCompose(): Promise<boolean> {
  // Check permissions before executing.
  const authentication = await Config.requireAs()

  // Create a request to perform this action.
  const request = await Worker.getAllComposeOfUser(authentication.id)
  const composes = request?.data?.composes

  info(
    `User ${print.name(authentication.username)} are related to ${print.bold(
      composes.length,
    )}  compose(s), including...`,
    pretty(composes),
  )
  log()

  return true
}

export default allCompose
