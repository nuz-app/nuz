import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'
import allScopes from '../user/allScopes'

import addCollaborator from './addCollaborator'
import createScope from './createScope'
import deleteScope from './deleteScope'
import getDetails from './getDetails'
import listCollaborators from './listCollaborators'
import removeCollaborator from './removeCollaborator'
import updateCollaborator from './updateCollaborator'

export function setCommands(yargs): void {
  yargs.command('scope', print.dim('Manage the scope'), function (child): void {
    setUsage(child, '$0 scope <item> [options]')

    child.command(
      'list',
      print.dim('Show the list scopes of current user [alias: user-my-scopes]'),
      (yarg) => yarg,
      wrapCommand(allScopes),
    )

    child.command(
      'get <scope> [fields..]',
      print.dim('Get compose details'),
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'create <name>',
      print.dim('Create the new scope'),
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
      print.dim('Manage the scope collaborators'),
      function (schild) {
        setUsage(schild, '$0 collaborator collaborator <type> [options]')

        schild.command(
          'add <scope> <user> [type]',
          print.dim('Add new collaborator to the list'),
          (yarg) => yarg,
          wrapCommand(addCollaborator),
        )

        schild.command(
          'update <scope> <user> <type>',
          print.dim('Update the collaborator information'),
          (yarg) => yarg,
          wrapCommand(updateCollaborator),
        )

        schild.command(
          'remove <scope> <user>',
          print.dim('Remove a collaborator from the list'),
          (yarg) => yarg,
          wrapCommand(removeCollaborator),
        )

        schild.command(
          'list <scope>',
          print.dim('Show all collaborators in the list'),
          (yarg) => yarg,
          wrapCommand(listCollaborators),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
