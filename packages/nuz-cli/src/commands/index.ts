import setUsage from '../utils/setUsage'
import showHelpIfInvalid from '../utils/showHelpIfInvalid'

import * as build from './build'
import * as compose from './compose'
import * as config from './config'
import * as dev from './dev'
import * as modules from './module'
import * as scope from './scope'
import * as serve from './serve'
import * as tools from './tools'
import checkUpdate from './tools/checkUpdate'
import * as user from './user'

export async function setCommands(yargs: any): Promise<any> {
  setUsage(yargs, '$0')

  //
  dev.setCommands(yargs)
  build.setCommands(yargs)
  serve.setCommands(yargs)

  //
  scope.setCommands(yargs)
  modules.setCommands(yargs)
  compose.setCommands(yargs)
  user.setCommands(yargs)

  //
  config.setCommands(yargs)
  tools.setCommands(yargs)

  showHelpIfInvalid(yargs, yargs.argv, 1, 2)

  checkUpdate()

  return yargs
}
