import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'
import allCompose from '../user/allCompose'

import addCollaborator from './addCollaborator'
import createCompose from './createCompose'
import deleteCompose from './deleteCompose'
import getDetails from './getDetails'
import listCollaborators from './listCollaborators'
import removeCollaborator from './removeCollaborator'
import removeModules from './removeModules'
import setModules from './setModules'
import updateCollaborator from './updateCollaborator'

export function setCommands(yargs: any): void {
  yargs.command('compose', print.dim('Manage the compose'), function (child) {
    setUsage(child, '$0 compose <item> [options]')

    child.command(
      'list',
      print.dim(
        'Show the list composes of current user [alias: user-my-composes]',
      ),
      (yarg) => yarg,
      wrapCommand(allCompose),
    )

    child.command(
      'get <compose> [fields..]',
      print.dim('Get compose details'),
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'create <name>',
      print.dim('Create the new compose'),
      (yarg) => yarg,
      wrapCommand(createCompose),
    )

    child.command(
      'delete <name>',
      print.dim('Delete a compose'),
      (yarg) => yarg,
      wrapCommand(deleteCompose),
    )

    child.command(
      'collaborator',
      print.dim('Manage the compose collaborators'),
      function (schild) {
        setUsage(schild, '$0 collaborator collaborator <type> [options]')

        schild.command(
          'add <compose> <user> [type]',
          print.dim('Add new collaborator to the list'),
          (yarg) => yarg,
          wrapCommand(addCollaborator),
        )

        schild.command(
          'update <compose> <user> <type>',
          print.dim('Update the collaborator information'),
          (yarg) => yarg,
          wrapCommand(updateCollaborator),
        )

        schild.command(
          'remove <compose> <user>',
          print.dim('Remove a collaborator from the list'),
          (yarg) => yarg,
          wrapCommand(removeCollaborator),
        )

        schild.command(
          'list <compose>',
          print.dim('Show all collaborators in the list'),
          (yarg) => yarg,
          wrapCommand(listCollaborators),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    child.command(
      'modules',
      print.dim('Manage the modules in a compose'),
      function (schild) {
        setUsage(schild, '$0 modules modules <type> [options]')

        schild.command(
          'set <compose> <modules..>',
          print.dim('Add modules to the compose'),
          (yarg) => yarg,
          wrapCommand(setModules),
        )

        schild.command(
          'remove <compose> <moduleIds..>',
          print.dim('Remove modules from the compose'),
          (yarg) => yarg,
          wrapCommand(removeModules),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
