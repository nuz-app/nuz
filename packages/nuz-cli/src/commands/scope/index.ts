import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import addCollaborator from './addCollaborator'
import removeCollaborator from './removeCollaborator'
import updateCollaborator from './updateCollaborator'

export const setCommands = (yargs) => {
  yargs.command('scope', 'Manage scope', (child) => {
    child.usage('usage: $0 scope <item> [options]')

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
