import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import getConfig from './getConfig'
import listConfig from './listConfig'
import setConfig from './setConfig'

export function setCommands(yargs) {
  yargs.command('config', 'Manage configuration', function (child) {
    child.usage('usage: $0 config <item> [options]')

    child.command(
      'set <key> <value>',
      'Set configuration',
      (yarg) => yarg,
      wrapCommand(setConfig),
    )

    child.command(
      'get <keys..>',
      'Get configuration',
      (yarg) => yarg,
      wrapCommand(getConfig),
    )

    child.command(
      'list',
      'List configuration',
      (yarg) => yarg,
      wrapCommand(listConfig),
    )

    showHelpIfInvalid(child, child.argv, 2)
  })
}
