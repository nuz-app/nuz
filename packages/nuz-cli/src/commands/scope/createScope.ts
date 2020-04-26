import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

async function createScope({ name }: Arguments<{ name: string }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const request = await Worker.createScope(name)
  const scopeId = request?.data?._id

  success(`Created ${print.name(scopeId)} scope successfully!`)
  return true
}

export default createScope
