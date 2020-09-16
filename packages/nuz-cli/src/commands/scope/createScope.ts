import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ScopeCreateScopeOptions extends Arguments<{ name: string }> {}

async function createScope(options: ScopeCreateScopeOptions): Promise<boolean> {
  const { name } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.createScope(name)
  const scopeId = request?.data?._id

  info(`The scope ${print.name(scopeId)} was created successfully!`)
  log()

  return true
}

export default createScope
