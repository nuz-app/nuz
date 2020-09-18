import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import checkUpdate from './checkUpdate'

export function setCommands(yargs): void {
  yargs.command('tools', print.dim('Support tools'), function (child) {
    setUsage(child, '$0 tools <item> [options]')

    child.command(
      'check-update',
      print.dim('Check update for package'),
      (yarg) => yarg,
      wrapCommand(checkUpdate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
