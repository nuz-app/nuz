import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

const noop = async () => {}

export const setCommands = (yargs) => {
  yargs.command('user', 'Manage user', (child) => {
    child.usage('usage: $0 user <item> [options]')

    child.command(
      'login',
      'Login as user in workspace',
      (yarg) => yarg,
      handleOnCommand(noop),
    )

    child.command(
      'logout',
      'Logout user from workspace',
      (yarg) => yarg,
      handleOnCommand(noop),
    )

    child.command(
      'register',
      'Register a user',
      (yarg) => yarg,
      handleOnCommand(noop),
    )

    showHelpIfInvalid(child, child.argv, 2)
  })
}
