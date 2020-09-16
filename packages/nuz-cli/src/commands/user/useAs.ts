import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import print, { log, success } from '../../utils/print'

interface UseUseAsOptions extends Arguments<{ username: string }> {}

async function useAs(options: UseUseAsOptions): Promise<boolean> {
  const { username } = options

  //
  await Config.use(username)

  success(`Switched to ${print.name(username)} account successfully!`)
  log()

  return true
}

export default useAs
