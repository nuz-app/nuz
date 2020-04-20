#!/usr/bin/env node

import yargs from 'yargs'

import * as commands from './commands'

// tslint:disable-next-line: prettier
(async function main() {
  commands.setCommands(yargs)

  // tslint:disable-next-line: no-unused-expression
  yargs.help().argv
})()
