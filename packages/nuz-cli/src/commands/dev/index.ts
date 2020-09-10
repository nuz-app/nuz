import { Arguments } from 'yargs'

import wrapCommand from '../../utils/wrapCommand'

import standalone from './standalone'
import workspaces from './workspaces'

interface DevOptions extends Arguments<{ workspaces?: string[] }> {}

async function dev(argv: DevOptions): Promise<boolean> {
  const useWorksapces = !!argv.workspaces

  return useWorksapces ? workspaces(argv as any) : standalone(argv as any)
}

export function setCommands(yargs): void {
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
    wrapCommand(dev),
  )
}
