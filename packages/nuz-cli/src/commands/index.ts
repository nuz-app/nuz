import { Argv } from 'yargs'

import showHelpIfInvalid from '../utils/showHelpIfInvalid'

import * as build from './build'
import * as composition from './composition'
import * as config from './config'
import * as dev from './dev'
import * as modules from './module'
import * as scope from './scope'
import * as serve from './serve'
import * as tools from './tools'
import * as user from './user'

export const setCommands = async (yargs: Argv) => {
  dev.setCommands(yargs)
  build.setCommands(yargs)
  serve.setCommands(yargs)

  config.setCommands(yargs)
  user.setCommands(yargs)
  scope.setCommands(yargs)
  modules.setCommands(yargs)
  composition.setCommands(yargs)

  tools.setCommands(yargs)

  showHelpIfInvalid(yargs, yargs.argv, 1, 2)

  return yargs
}
