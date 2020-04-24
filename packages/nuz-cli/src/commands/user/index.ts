import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

import login from './login'
import logout from './logout'

const noop = async () => {}

export const setCommands = (yargs) => {
  yargs.command('user', 'Manage user', (child) => {
    child.usage('usage: $0 user <item> [options]')

    child.command(
      'login',
      'Login user account',
      (yarg) => yarg,
      handleOnCommand(login),
    )

    child.command(
      'logout',
      'Logout of user account',
      (yarg) => yarg,
      handleOnCommand(logout),
    )

    child.command(
      'register',
      'Register a new user',
      (yarg) => yarg,
      handleOnCommand(noop),
    )

    showHelpIfInvalid(child, child.argv, 2)
  })

  yargs.command(
    'login',
    'Login user account [alias: user-login]',
    (yarg) => yarg,
    handleOnCommand(login),
  )

  yargs.command(
    'logout',
    'Logout of user account [alias: user-logout]',
    (yarg) => yarg,
    handleOnCommand(logout),
  )

  yargs.command(
    'register',
    'Register a new user [alias: user-register]',
    (yarg) => yarg,
    handleOnCommand(noop),
  )
}
