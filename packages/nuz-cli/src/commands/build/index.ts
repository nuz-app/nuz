import wrapCommand from '../../utils/wrapCommand'

import optimized from './optimized'

export function setCommands(yargs: any): void {
  yargs.command(
    'build',
    'Start build optimized mode for production',
    (child) => child,
    wrapCommand(optimized),
  )
}
