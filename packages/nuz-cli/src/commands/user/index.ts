import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

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

export const setCommands = (yargs) => {
  yargs.command('user', 'Manage user', (child) => {
    child.usage('usage: $0 user <item> [options]')

    child.command(
      'whoami',
      'Who I am?',
      (yarg) => yarg,
      handleOnCommand(whoami),
    )

    child.command(
      'login [username]',
      'Login user account',
      (yarg) =>
        yarg.option('registry', {
          describe: 'Log into the specified registry',
          type: 'string',
          required: false,
        }),
      handleOnCommand(loginAsUser),
    )

    child.command(
      'logout [username]',
      'Logout of user account',
      (yarg) => yarg,
      handleOnCommand(logoutFromUser),
    )

    child.command(
      'register',
      'Register a new user',
      (yarg) => yarg,
      handleOnCommand(createUser),
    )

    child.command(
      'list',
      'List all users in work folder',
      (yarg) => yarg,
      handleOnCommand(listUsers),
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
      handleOnCommand(useAs),
    )

    child.command('token', 'Manage token of user', (schild) => {
      schild.usage('usage: $0 user token <type> [options]')

      schild.command(
        'create <type>',
        'Create a token for user',
        (yarg) => yarg,
        handleOnCommand(createToken),
      )

      schild.command(
        'delete <token>',
        'Delete a token from user',
        (yarg) => yarg,
        handleOnCommand(deleteToken),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    child.command('my', 'Show my list', (schild) => {
      schild.usage('usage: $0 user my <type> [options]')

      schild.command(
        'composes',
        'List composes of current user',
        (yarg) => yarg,
        handleOnCommand(allCompose),
      )

      schild.command(
        'scopes',
        'List scopes of current user',
        (yarg) => yarg,
        handleOnCommand(allScopes),
      )

      schild.command(
        'modules',
        'List modules of current user',
        (yarg) => yarg,
        handleOnCommand(allModules),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'whoami',
    'Who I am? [alias: user-whoami]',
    (yarg) => yarg,
    handleOnCommand(whoami),
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
    handleOnCommand(loginAsUser),
  )

  yargs.command(
    'logout [username]',
    'Logout of user account [alias: user-logout]',
    (yarg) => yarg,
    handleOnCommand(logoutFromUser),
  )

  yargs.command(
    'register',
    'Register a new user [alias: user-register]',
    (yarg) => yarg,
    handleOnCommand(createUser),
  )
}
