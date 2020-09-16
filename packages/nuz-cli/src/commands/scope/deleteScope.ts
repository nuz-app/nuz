import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

async function deleteScope({
  name,
}: Arguments<{ name: string }>): Promise<boolean> {
  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.deleteScope(name)
  const scopeId = request?.data?._id

  info(`The scope ${print.name(scopeId)} was deleted successfully!`)
  log()

  return true
}

export default deleteScope
