import { Argv } from 'yargs'

import * as build from './commands/build'
import * as create from './commands/create'
import * as dev from './commands/dev'
import * as publish from './commands/publish'
import * as serve from './commands/serve'
import * as workspace from './commands/workspace'

export const setCommands = async (yargs: Argv) => {
  build.setCommands(yargs)
  create.setCommands(yargs)
  dev.setCommands(yargs)
  publish.setCommands(yargs)
  serve.setCommands(yargs)
  workspace.setCommands(yargs)

  return yargs
}
