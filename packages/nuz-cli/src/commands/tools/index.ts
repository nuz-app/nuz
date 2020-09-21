import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import checkUpdate from './checkUpdate'
import status from './status'

export function setCommands(yargs): void {
  yargs.command('tools', print.dim('Support tools'), function (child) {
    setUsage(child, '$0 tools <item> [options]')

    child.command(
      'check-update',
      print.dim('Check update for the package'),
      (yarg) => yarg,
      wrapCommand(checkUpdate),
    )

    child.command(
      'status',
      print.dim('Check the system status'),
      (yarg) => yarg,
      wrapCommand(status),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'status',
    print.dim('Check the system status [alias: tools-status]'),
    (yarg) => yarg,
    wrapCommand(status),
  )
}
