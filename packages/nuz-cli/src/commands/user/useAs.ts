import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import print, { success } from '../../utils/print'

async function useAs({ username }: Arguments<{ username: string }>) {
  await Config.use(username)

  success(`Switched to ${print.name(username)} account successfully!`)
  return true
}

export default useAs
