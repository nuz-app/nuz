import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import getConfig from './getConfig'
import listConfig from './listConfig'
import setConfig from './setConfig'

export function setCommands(yargs) {
  yargs.command('config', print.dim('Manage the configuration'), function (
    child,
  ): void {
    setUsage(child, '$0 config <item> [options]')

    child.command(
      'set <key> <value>',
      print.dim('Set configuration'),
      (yarg) => yarg,
      wrapCommand(setConfig),
    )

    child.command(
      'get <keys..>',
      print.dim('Get configuration'),
      (yarg) => yarg,
      wrapCommand(getConfig),
    )

    child.command(
      'list',
      print.dim('List configuration'),
      (yarg) => yarg,
      wrapCommand(listConfig),
    )

    showHelpIfInvalid(child, child.argv, 2)
  })
}
