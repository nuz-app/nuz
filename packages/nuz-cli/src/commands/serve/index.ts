import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import wrapCommand from '../../utils/wrapCommand'

import serve from './serve'

export function setCommands(yargs: any): void {
  yargs.command(
    'serve',
    print.dim('File serving and directory listing in the module'),
    (child) =>
      setUsage(
        child.option('port', {
          describe: 'Serve port',
          type: 'number',
          required: false,
        }),
        '$0 serve',
      ),
    wrapCommand(serve),
  )
}
