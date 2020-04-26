import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import addCollaborator from './addCollaborator'
import createComposition from './createComposition'
import deleteComposition from './deleteComposition'
import removeCollaborator from './removeCollaborator'
import updateCollaborator from './updateCollaborator'

export const setCommands = (yargs) => {
  yargs.command('composition', 'Manage composition', (child) => {
    child.usage('usage: $0 composition <item> [options]')

    child.command(
      'create <name>',
      'Create a composition',
      (yarg) => yarg,
      handleOnCommand(createComposition),
    )

    child.command(
      'delete <name>',
      'Delete a composition',
      (yarg) => yarg,
      handleOnCommand(deleteComposition),
    )

    child.command(
      'collaborator',
      'Manage collaborator of composition',
      (schild) => {
        schild.usage('usage: $0 composition collaborator <type> [options]')

        schild.command(
          'add <composition> <user> [type]',
          'Add collaborator to the composition',
          (yarg) => yarg,
          handleOnCommand(addCollaborator),
        )

        schild.command(
          'update <composition> <user> <type>',
          'Update collaborator of the composition',
          (yarg) => yarg,
          handleOnCommand(updateCollaborator),
        )

        schild.command(
          'remove <composition> <user>',
          'Remove collaborator from the composition',
          (yarg) => yarg,
          handleOnCommand(removeCollaborator),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
