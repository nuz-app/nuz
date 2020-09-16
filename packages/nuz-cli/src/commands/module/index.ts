import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import addCollaborator from './addCollaborator'
import create from './create'
import getDetails from './getDetails'
import listCollaborators from './listCollaborators'
import publish from './publish'
import removeCollaborator from './removeCollaborator'
import setDeprecate from './setDeprecate'
import updateCollaborator from './updateCollaborator'

export function setCommands(yargs): void {
  yargs.command('module', 'Manage module', function (child) {
    child.usage('usage: $0 module <item> [options]')

    child.command(
      'create [name] [template]',
      'Create new module',
      (yarg) => yarg,
      wrapCommand(create),
    )

    child.command(
      'get <module> [fields..]',
      'Get details of a module',
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'publish [fallback]',
      'Publish version for the module',
      (yarg) =>
        yarg.option('self-hosted', {
          describe: 'Is publish as self hosted',
          type: 'boolean',
          default: false,
          required: false,
        }),
      wrapCommand(publish),
    )

    child.command('collaborator', 'Manage collaborator of module', function (
      schild,
    ) {
      schild.usage('usage: $0 module collaborator <type> [options]')

      schild.command(
        'add <module> <user> [type]',
        'Add collaborator to the module',
        (yarg) => yarg,
        wrapCommand(addCollaborator),
      )

      schild.command(
        'update <module> <user> <type>',
        'Update collaborator of the module',
        (yarg) => yarg,
        wrapCommand(updateCollaborator),
      )

      schild.command(
        'remove <module> <user>',
        'Remove collaborator from the module',
        (yarg) => yarg,
        wrapCommand(removeCollaborator),
      )

      schild.command(
        'list <module>',
        'List collaborators of the module',
        (yarg) => yarg,
        wrapCommand(listCollaborators),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    child.command(
      'deprecate <module> <versions> [deprecate]',
      'Deprecate a module',
      (yarg) => yarg,
      wrapCommand(setDeprecate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'create [name] [template]',
    'Create new module [alias: module-create]',
    (yarg) => yarg,
    wrapCommand(create),
  )

  yargs.command(
    'publish [fallback]',
    `Publish version for the module [alias: module-publish]`,
    (yarg) => yarg,
    wrapCommand(publish),
  )
}
