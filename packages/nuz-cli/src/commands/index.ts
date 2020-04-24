import { Argv } from 'yargs'

import showHelpIfInvalid from '../utils/showHelpIfInvalid'

import * as config from './config'
import * as modules from './module'
import * as scope from './scope'
import * as user from './user'

export const setCommands = async (yargs: Argv) => {
  config.setCommands(yargs)
  user.setCommands(yargs)
  scope.setCommands(yargs)
  modules.setCommands(yargs)

  showHelpIfInvalid(yargs, yargs.argv, 1, 2)

  return yargs
}
