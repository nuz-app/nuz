import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function createComposition({ name }: Arguments<{ name: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.createComposition(name)
  const compositionId = request?.data?._id

  success(`Created ${print.name(compositionId)} composition successfully!`)
  return true
}

export default createComposition
