import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import createToken from './createToken'
import deleteToken from './deleteToken'
import list from './list'
import login from './login'
import logout from './logout'
import register from './register'
import use from './use'
import whoami from './whoami'

const setPositionalForRegister = (yarg) =>
  yarg.positional('username', {
    describe: 'Username wants to log out',
    type: 'string',
    required: false,
  })

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
      'login',
      'Login user account',
      (yarg) => yarg,
      handleOnCommand(login),
    )

    child.command(
      'logout [username]',
      'Logout of user account',
      setPositionalForRegister,
      handleOnCommand(logout),
    )

    child.command(
      'register',
      'Register a new user',
      (yarg) => yarg,
      handleOnCommand(register),
    )

    child.command(
      'list',
      'List all users in work folder',
      (yarg) => yarg,
      handleOnCommand(list),
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
      handleOnCommand(use),
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

      showHelpIfInvalid(schild, schild.argv, 3)
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
    'login',
    'Login user account [alias: user-login]',
    (yarg) => yarg,
    handleOnCommand(login),
  )

  yargs.command(
    'logout [username]',
    'Logout of user account [alias: user-logout]',
    setPositionalForRegister,
    handleOnCommand(logout),
  )

  yargs.command(
    'register',
    'Register a new user [alias: user-register]',
    (yarg) => yarg,
    handleOnCommand(register),
  )
}
