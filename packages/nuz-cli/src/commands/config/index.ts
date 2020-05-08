import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import getConfig from './getConfig'
import listConfig from './listConfig'
import setConfig from './setConfig'

export const setCommands = (yargs) => {
  yargs.command('config', 'Manage configuration', (child) => {
    child.usage('usage: $0 config <item> [options]')

    child.command(
      'set <key> <value>',
      'Set configuration',
      (yarg) => yarg,
      handleOnCommand(setConfig),
    )

    child.command(
      'get <keys..>',
      'Get configuration',
      (yarg) => yarg,
      handleOnCommand(getConfig),
    )

    child.command(
      'list',
      'List configuration',
      (yarg) => yarg,
      handleOnCommand(listConfig),
    )

    showHelpIfInvalid(child, child.argv, 2)
  })
}
