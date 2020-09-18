import { Arguments } from 'yargs'

import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
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
    print.dim('Start the development mode for the module(s)'),
    (child) =>
      setUsage(
        child
          .option('workspaces', {
            describe: print.dim('Use workspaces'),
            type: 'array',
            required: false,
          })
          .option('port', {
            describe: print.dim('Serve port'),
            type: 'number',
            required: false,
          })
          .option('open', {
            describe: print.dim('Open browser'),
            type: 'boolean',
            required: false,
          }),
        '$0 dev',
      ),
    wrapCommand(dev),
  )
}
