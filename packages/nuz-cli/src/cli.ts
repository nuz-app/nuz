#!/usr/bin/env node

import yargs from 'yargs'

import Config from './classes/Config'

import * as commands from './commands'

// tslint:disable-next-line: prettier
;(async function main() {
  // Prepare `.nuz` folder to manage config
  await Config.prepare()

  // Bind all comands to cli
  await commands.setCommands(yargs)

  // tslint:disable-next-line: no-unused-expression
  yargs.help().argv
})()
