import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

interface ComposeCreateComposeOptions extends Arguments<{ name: string }> {}

async function createCompose(
  options: ComposeCreateComposeOptions,
): Promise<boolean> {
  const { name } = options

  // Check permissions before executing.
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  // Create a request to perform this action.
  const request = await Worker.createCompose(name)
  const composeId = request?.data?._id

  info(`The compose ${print.name(composeId)} was created successfully!`)
  log()

  return true
}

export default createCompose
