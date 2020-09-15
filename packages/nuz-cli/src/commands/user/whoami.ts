import Config from '../../classes/Config'
import { ROOT_USER_DEFAULT_DIRECTORY } from '../../lib/const'
import print, { info } from '../../utils/print'

async function whoami(): Promise<boolean> {
  const authentication = await Config.whoami()

  //
  if (authentication.username === ROOT_USER_DEFAULT_DIRECTORY) {
    info('You are using the default configuration!')

    return true
  }

  info(`You are ${print.name(authentication.username)}.`)

  return true
}

export default whoami
