import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import checkUpdate from './checkUpdate'

export const setCommands = (yargs) => {
  yargs.command('tools', 'Support tools', (child) => {
    child.usage('usage: $0 tools <item> [options]')

    child.command(
      'check-update',
      'Check update for package',
      (yarg) => yarg,
      handleOnCommand(checkUpdate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
