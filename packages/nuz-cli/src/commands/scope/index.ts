import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import addCollaborator from './addCollaborator'
import createScope from './createScope'
import deleteScope from './deleteScope'
import getDetails from './getDetails'
import listCollaborators from './listCollaborators'
import removeCollaborator from './removeCollaborator'
import updateCollaborator from './updateCollaborator'

export function setCommands(yargs): void {
  yargs.command('scope', print.dim('Manage scope'), function (child): void {
    setUsage(child, '$0 scope <item> [options]')

    child.command(
      'get <scope> [fields..]',
      print.dim('Get details of a scope'),
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'create <name>',
      print.dim('Create a scope'),
      (yarg) => yarg,
      wrapCommand(createScope),
    )

    child.command(
      'delete <name>',
      print.dim('Delete a scope'),
      (yarg) => yarg,
      wrapCommand(deleteScope),
    )

    child.command(
      'collaborator',
      print.dim('Manage collaborator of scope'),
      function (schild): void {
        setUsage(schild, '$0 scope collaborator <type> [options]')

        schild.command(
          'add <scope> <user> [type]',
          print.dim('Add collaborator to the scope'),
          (yarg) => yarg,
          wrapCommand(addCollaborator),
        )

        schild.command(
          'update <scope> <user> <type>',
          print.dim('Update collaborator of the scope'),
          (yarg) => yarg,
          wrapCommand(updateCollaborator),
        )

        schild.command(
          'remove <scope> <user>',
          print.dim('Remove collaborator from the scope'),
          (yarg) => yarg,
          wrapCommand(removeCollaborator),
        )

        schild.command(
          'list <scope>',
          print.dim('List collaborators of the scope'),
          (yarg) => yarg,
          wrapCommand(listCollaborators),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
