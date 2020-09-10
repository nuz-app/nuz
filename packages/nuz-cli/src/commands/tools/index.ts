import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import checkUpdate from './checkUpdate'

export const setCommands = (yargs) => {
  yargs.command('tools', 'Support tools', (child) => {
    child.usage('usage: $0 tools <item> [options]')

    child.command(
      'check-update',
      'Check update for package',
      (yarg) => yarg,
      wrapCommand(checkUpdate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
