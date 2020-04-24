import Config from '../../classes/Config'

import { NUZ_DEFAULT_USERNAME } from '../../lib/const'
import print, { info } from '../../utils/print'

async function whoami() {
  const { username } = await Config.whoami()
  if (username === NUZ_DEFAULT_USERNAME) {
    info('You are using the default configuration!')
    return true
  }

  info(`You are ${print.name(username)}.`)
  return true
}

export default whoami
