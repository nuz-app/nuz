import { Arguments } from 'yargs'

import handleOnCommand from '../../utils/handleOnCommand'

import standalone from './standalone'
import workspaces from './workspaces'

async function dev(argv: Arguments<{ workspaces?: string[] }>) {
  const isWorkspaces = !!argv.workspaces

  const result = await (isWorkspaces
    ? workspaces(argv as any)
    : standalone(argv as any))
  return result
}

export const setCommands = (yargs) => {
  yargs.command(
    'dev',
    'Start the development mode for the module(s)',
    (child) =>
      child
        .option('workspaces', {
          describe: 'Use workspaces',
          type: 'array',
          required: false,
        })
        .option('port', {
          describe: 'Serve port',
          type: 'number',
          required: false,
        })
        .option('open', {
          describe: 'Open browser',
          type: 'boolean',
          required: false,
        }),
    handleOnCommand(dev),
  )
}
