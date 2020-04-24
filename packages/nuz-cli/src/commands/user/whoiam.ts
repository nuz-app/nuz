import Config from '../../classes/Config'

import { NUZ_DEFAULT_USERNAME } from '../../lib/const'
import print, { info } from '../../utils/print'

async function whoiam() {
  const who = await Config.whoiam()
  if (who.username === NUZ_DEFAULT_USERNAME) {
    info('You are using the default configuration!')
    return true
  }

  info(`You are ${print.name(who.username)}.`)
  return true
}

export default whoiam
