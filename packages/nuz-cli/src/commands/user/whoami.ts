import Config from '../../classes/Config'
import { ROOT_USER_DEFAULT_DIRECTORY } from '../../lib/const'
import print, { info, log } from '../../utils/print'

async function whoami(): Promise<boolean> {
  const authentication = await Config.whoami()

  //
  if (authentication.username === ROOT_USER_DEFAULT_DIRECTORY) {
    info('You are using the default configuration. Enjoy everything with Nuz!')
    log()

    return true
  }

  info(
    `You are ${print.name(
      authentication.username,
    )}. Enjoy everything with Nuz!`,
  )
  log()

  return true
}

export default whoami
