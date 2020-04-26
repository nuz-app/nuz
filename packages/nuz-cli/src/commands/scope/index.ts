import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import addCollaborator from './addCollaborator'
import createScope from './createScope'
import deleteScope from './deleteScope'
import removeCollaborator from './removeCollaborator'
import updateCollaborator from './updateCollaborator'

export const setCommands = (yargs) => {
  yargs.command('scope', 'Manage scope', (child) => {
    child.usage('usage: $0 scope <item> [options]')

    child.command(
      'create <name>',
      'Create a scope',
      (yarg) => yarg,
      handleOnCommand(createScope),
    )

    child.command(
      'delete <name>',
      'Delete a scope',
      (yarg) => yarg,
      handleOnCommand(deleteScope),
    )

    child.command('collaborator', 'Manage collaborator of scope', (schild) => {
      schild.usage('usage: $0 scope collaborator <type> [options]')

      schild.command(
        'add <scope> <user> [type]',
        'Add collaborator to the scope',
        (yarg) => yarg,
        handleOnCommand(addCollaborator),
      )

      schild.command(
        'update <scope> <user> <type>',
        'Update collaborator of the scope',
        (yarg) => yarg,
        handleOnCommand(updateCollaborator),
      )

      schild.command(
        'remove <scope> <user>',
        'Remove collaborator from the scope',
        (yarg) => yarg,
        handleOnCommand(removeCollaborator),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
