import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function createCompose({ name }: Arguments<{ name: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.createCompose(name)
  const composeId = request?.data?._id

  info(`Created ${print.name(composeId)} compose successfully!`)
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default createCompose
