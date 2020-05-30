import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function deleteCompose({ name }: Arguments<{ name: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.deleteCompose(name)
  const composeId = request?.data?._id

  info(`Deleted ${print.name(composeId)} compose successfully!`)
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default deleteCompose
