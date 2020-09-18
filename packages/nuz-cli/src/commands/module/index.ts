import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
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
  yargs.command('module', print.dim('Manage module'), function (child) {
    setUsage(child, '$0 module <item> [options]')

    child.command(
      'create [name] [template]',
      print.dim('Create new module'),
      (yarg) => yarg,
      wrapCommand(create),
    )

    child.command(
      'get <module> [fields..]',
      print.dim('Get details of a module'),
      (yarg) => yarg,
      wrapCommand(getDetails),
    )

    child.command(
      'publish [fallback]',
      print.dim('Publish version for the module'),
      (yarg) =>
        yarg
          .option('yes', {
            describe: print.dim('Publish without confirmation'),
            type: 'boolean',
            default: false,
            required: false,
          })
          .option('token', {
            describe: print.dim('Override authentication token'),
            type: 'string',
            required: false,
          })
          .option('registry', {
            describe: print.dim('Override registry service endpoint'),
            type: 'string',
            required: false,
          })
          .option('static', {
            describe: print.dim('Override static origin value'),
            type: 'string',
            required: false,
          }),
      wrapCommand(publish),
    )

    child.command(
      'collaborator',
      print.dim('Manage collaborator of module'),
      function (schild) {
        setUsage(schild, '$0 module collaborator <type> [options]')

        schild.command(
          'add <module> <user> [type]',
          print.dim('Add collaborator to the module'),
          (yarg) => yarg,
          wrapCommand(addCollaborator),
        )

        schild.command(
          'update <module> <user> <type>',
          print.dim('Update collaborator of the module'),
          (yarg) => yarg,
          wrapCommand(updateCollaborator),
        )

        schild.command(
          'remove <module> <user>',
          print.dim('Remove collaborator from the module'),
          (yarg) => yarg,
          wrapCommand(removeCollaborator),
        )

        schild.command(
          'list <module>',
          print.dim('List collaborators of the module'),
          (yarg) => yarg,
          wrapCommand(listCollaborators),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    child.command(
      'deprecate <module> <versions> [deprecate]',
      print.dim('Deprecate a module'),
      (yarg) => yarg,
      wrapCommand(setDeprecate),
    )

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'create [name] [template]',
    print.dim('Create new module [alias: module-create]'),
    (yarg) => yarg,
    wrapCommand(create),
  )

  yargs.command(
    'publish [fallback]',
    print.dim(`Publish version for the module [alias: module-publish]`),
    (yarg) => yarg,
    wrapCommand(publish),
  )
}
