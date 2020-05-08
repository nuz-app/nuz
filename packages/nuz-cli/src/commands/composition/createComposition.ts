import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

async function createComposition({ name }: Arguments<{ name: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const tick = timer()
  const request = await Worker.createComposition(name)
  const compositionId = request?.data?._id

  info(`Created ${print.name(compositionId)} composition successfully!`)
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default createComposition
