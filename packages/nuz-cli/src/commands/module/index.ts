import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import addCollaborator from './addCollaborator'
import removeCollaborator from './removeCollaborator'
import setDeprecate from './setDeprecate'
import updateCollaborator from './updateCollaborator'

export const setCommands = (yargs) => {
  yargs.command('module', 'Manage module', (child) => {
    child.usage('usage: $0 module <item> [options]')

    child.command('collaborator', 'Manage collaborator of module', (schild) => {
      schild.usage('usage: $0 module collaborator <type> [options]')

      schild.command(
        'add <module> <user> [type]',
        'Add collaborator to the module',
        (yarg) => yarg,
        handleOnCommand(addCollaborator),
      )

      schild.command(
        'update <module> <user> <type>',
        'Update collaborator of the module',
        (yarg) => yarg,
        handleOnCommand(updateCollaborator),
      )

      schild.command(
        'remove <module> <user>',
        'Remove collaborator from the module',
        (yarg) => yarg,
        handleOnCommand(removeCollaborator),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    child.command(
      'deprecate <module> <versions> [deprecate]',
      'Deprecate a module',
      (yarg) => yarg,
      handleOnCommand(setDeprecate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })
}
