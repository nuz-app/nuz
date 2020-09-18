import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import wrapCommand from '../../utils/wrapCommand'

import optimized from './optimized'

export function setCommands(yargs: any): void {
  yargs.command(
    'build',
    print.dim('Start build optimized mode for production'),
    (child) => setUsage(child, '$0 build'),
    wrapCommand(optimized),
  )
}
