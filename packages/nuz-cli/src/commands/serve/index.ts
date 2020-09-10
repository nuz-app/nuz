import wrapCommand from '../../utils/wrapCommand'

import serve from './serve'

export function setCommands(yargs: any): void {
  yargs.command(
    'serve',
    'File serving and directory listing in the module',
    (child) =>
      child.option('port', {
        describe: 'Serve port',
        type: 'number',
        required: false,
      }),
    wrapCommand(serve),
  )
}
