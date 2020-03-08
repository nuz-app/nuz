#!/usr/bin/env node

import yargs from 'yargs'

import commands from './commands'

// tslint:disable-next-line: prettier
(async function main() {
  for (const cmd of commands) {
    const { type, description, transform, execute } = cmd
    yargs.command(type, description, transform, execute)
  }

  // tslint:disable-next-line: no-unused-expression
  yargs.help().argv
})()
