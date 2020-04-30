import handleOnCommand from '../../utils/handleOnCommand'

import optimized from './optimized'

export const setCommands = (yargs) => {
  yargs.command(
    'build',
    'Start build optimized mode for production',
    (child) => child,
    handleOnCommand(optimized),
  )
}
