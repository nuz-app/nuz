import { Argv } from 'yargs'

import showHelpIfInvalid from '../utils/showHelpIfInvalid'

import * as config from './config'
import * as user from './user'

export const setCommands = async (yargs: Argv) => {
  config.setCommands(yargs)
  user.setCommands(yargs)

  showHelpIfInvalid(yargs, yargs.argv, 1, 2)

  return yargs
}
