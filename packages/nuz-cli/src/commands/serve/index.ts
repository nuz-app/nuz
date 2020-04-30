import handleOnCommand from '../../utils/handleOnCommand'

import serve from './serve'

export const setCommands = (yargs) => {
  yargs.command(
    'serve',
    'File serving and directory listing in the module',
    (child) =>
      child.option('port', {
        describe: 'Serve port',
        type: 'number',
        required: false,
      }),
    handleOnCommand(serve),
  )
}
