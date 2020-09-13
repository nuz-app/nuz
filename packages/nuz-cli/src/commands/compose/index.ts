import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import addCollaborator from './addCollaborator'
import createCompose from './createCompose'
import deleteCompose from './deleteCompose'
import getDetails from './getDetails'
import removeCollaborator from './removeCollaborator'
import removeModules from './removeModules'
import setModules from './setModules'
import updateCollaborator from './updateCollaborator'

export function setCommands(yargs: any): void {
  yargs.command('compose', 'Manage compose', function (child) {
    child.usage('usage: $0 compose <item> [options]')

    child.command(
      'get <compose> [fields..]',
      'Get details of a compose',
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'create <name>',
      'Create a compose',
      (yarg) => yarg,
      wrapCommand(createCompose),
    )

    child.command(
      'delete <name>',
      'Delete a compose',
      (yarg) => yarg,
      wrapCommand(deleteCompose),
    )

    child.command('collaborator', 'Manage collaborator of compose', function (
      schild,
    ) {
      schild.usage('usage: $0 compose collaborator <type> [options]')

      schild.command(
        'add <compose> <user> [type]',
        'Add collaborator to the compose',
        (yarg) => yarg,
        wrapCommand(addCollaborator),
      )

      schild.command(
        'update <compose> <user> <type>',
        'Update collaborator of the compose',
        (yarg) => yarg,
        wrapCommand(updateCollaborator),
      )

      schild.command(
        'remove <compose> <user>',
        'Remove collaborator from the compose',
        (yarg) => yarg,
        wrapCommand(removeCollaborator),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    child.command('modules', 'Manage modules of compose', function (schild) {
      schild.usage('usage: $0 compose modules <type> [options]')

      schild.command(
        'set <compose> <modules..>',
        'Set modules for the compose',
        (yarg) => yarg,
        wrapCommand(setModules),
      )

      schild.command(
        'remove <compose> <moduleIds..>',
        'Remove modules from the compose',
        (yarg) => yarg,
        wrapCommand(removeModules),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
