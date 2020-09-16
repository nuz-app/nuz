import showHelpIfInvalid from '../../utils/showHelpIfInvalid'
import wrapCommand from '../../utils/wrapCommand'

import allCompose from './allCompose'
import allModules from './allModules'
import allScopes from './allScopes'
import createToken from './createToken'
import createUser from './createUser'
import deleteToken from './deleteToken'
import listUsers from './listUsers'
import loginAsUser from './loginAsUser'
import logoutFromUser from './logoutFromUser'
import useAs from './useAs'
import whoami from './whoami'

export function setCommands(yargs): void {
  yargs.command('user', 'Manage user', function (child): void {
    child.usage('usage: $0 user <item> [options]')

    child.command('whoami', 'Who I am?', (yarg) => yarg, wrapCommand(whoami))

    child.command(
      'login [username]',
      'Login user account',
      (yarg) =>
        yarg.option('registry', {
          describe: 'Log into the specified registry',
          type: 'string',
          required: false,
        }),
      wrapCommand(loginAsUser),
    )

    child.command(
      'logout [username]',
      'Logout of user account',
      (yarg) => yarg,
      wrapCommand(logoutFromUser),
    )

    child.command(
      'register',
      'Register a new user',
      (yarg) => yarg,
      wrapCommand(createUser),
    )

    child.command(
      'list',
      'List all users in work folder',
      (yarg) => yarg,
      wrapCommand(listUsers),
    )

    child.command(
      'use <username>',
      'Switch to using other user in work folder',
      (yarg) =>
        yarg.positional('username', {
          describe: 'Username wants to use',
          type: 'string',
          required: true,
        }),
      wrapCommand(useAs),
    )

    child.command('token', 'Manage token of user', function (schild): void {
      schild.usage('usage: $0 user token <type> [options]')

      schild.command(
        'create <type>',
        'Create a token for user',
        (yarg) => yarg,
        wrapCommand(createToken),
      )

      schild.command(
        'delete <token>',
        'Delete a token from user',
        (yarg) => yarg,
        wrapCommand(deleteToken),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    child.command('my', 'Show my list', function (schild): void {
      schild.usage('usage: $0 user my <type> [options]')

      schild.command(
        'composes',
        'List composes of current user',
        (yarg) => yarg,
        wrapCommand(allCompose),
      )

      schild.command(
        'scopes',
        'List scopes of current user',
        (yarg) => yarg,
        wrapCommand(allScopes),
      )

      schild.command(
        'modules',
        'List modules of current user',
        (yarg) => yarg,
        wrapCommand(allModules),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'whoami',
    'Who I am? [alias: user-whoami]',
    (yarg) => yarg,
    wrapCommand(whoami),
  )

  yargs.command(
    'login [username]',
    'Login user account [alias: user-login]',
    (yarg) =>
      yarg.option('registry', {
        describe: 'Log into the specified registry',
        type: 'string',
        required: false,
      }),
    wrapCommand(loginAsUser),
  )

  yargs.command(
    'logout [username]',
    'Logout of user account [alias: user-logout]',
    (yarg) => yarg,
    wrapCommand(logoutFromUser),
  )

  yargs.command(
    'register',
    'Register a new user [alias: user-register]',
    (yarg) => yarg,
    wrapCommand(createUser),
  )
}
