import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

interface ComposeDeleteComposeOptions extends Arguments<{ name: string }> {}

async function deleteCompose(
  options: ComposeDeleteComposeOptions,
): Promise<boolean> {
  const { name } = options

  // Check permissions before executing
  await Config.requireAs(UserAccessTokenTypes.fullAccess)

  const tick = timer()

  //
  const request = await Worker.deleteCompose(name)
  const composeId = request?.data?._id

  info(`Deleted ${print.name(composeId)} compose successfully!`)
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default deleteCompose
