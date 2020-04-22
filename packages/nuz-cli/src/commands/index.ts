import { Argv } from 'yargs'

import * as config from './config'

import * as build from './build'
import * as create from './create'
import * as dev from './dev'
import * as publish from './publish'
import * as serve from './serve'
import * as workspace from './workspace'

export const setCommands = async (yargs: Argv) => {
  config.setCommands(yargs)

  build.setCommands(yargs)
  create.setCommands(yargs)
  dev.setCommands(yargs)
  publish.setCommands(yargs)
  serve.setCommands(yargs)
  workspace.setCommands(yargs)

  return yargs
}
