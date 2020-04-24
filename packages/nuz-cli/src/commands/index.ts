import { Argv } from 'yargs'

import * as config from './config'
import * as user from './user'

export const setCommands = async (yargs: Argv) => {
  config.setCommands(yargs)
  user.setCommands(yargs)

  return yargs
}
