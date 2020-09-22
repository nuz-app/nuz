import print from '../../utils/print'
import setUsage from '../../utils/setUsage'
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
  yargs.command('user', print.dim('Manage the user'), function (child): void {
    setUsage(child, 'usage: $0 user <item> [options]')

    child.command(
      'whoami',
      print.dim('Who I am?'),
      (yarg) => yarg,
      wrapCommand(whoami),
    )

    child.command(
      'login',
      print.dim('Sign in to your user'),
      (yarg) =>
        yarg
          .option('registry', {
            describe: 'Specified the registry service want to sign in',
            type: 'string',
            required: false,
          })
          .option('force', {
            describe: 'Force sign in to user and regenerate token',
            type: 'boolean',
            default: false,
            required: false,
          }),
      wrapCommand(loginAsUser),
    )

    child.command(
      'logout [username]',
      print.dim('Sign out of this user'),
      (yarg) => yarg,
      wrapCommand(logoutFromUser),
    )

    child.command(
      'register',
      print.dim('Create the new user'),
      (yarg) => yarg,
      wrapCommand(createUser),
    )

    child.command(
      'list',
      print.dim('Show the list of logged-in users'),
      (yarg) => yarg,
      wrapCommand(listUsers),
    )

    child.command(
      'use <username>',
      print.dim('Switch to another logged-in user'),
      (yarg) => yarg,
      wrapCommand(useAs),
    )

    child.command(
      'token',
      print.dim('Manage the tokens of current user'),
      function (schild): void {
        setUsage(schild, '$0 user token <type> [options]')

        schild.command(
          'create <type>',
          print.dim('Create new token for current user'),
          (yarg) => yarg,
          wrapCommand(createToken),
        )

        schild.command(
          'delete <token>',
          print.dim('Delete a token from current user'),
          (yarg) => yarg,
          wrapCommand(deleteToken),
        )

        showHelpIfInvalid(schild, schild.argv, 3, 4)
      },
    )

    child.command('my', print.dim('Show the list of current user'), function (
      schild,
    ): void {
      setUsage(schild, '$0 user my <type> [options]')

      schild.command(
        'composes',
        print.dim('Show the list composes of current user'),
        (yarg) => yarg,
        wrapCommand(allCompose),
      )

      schild.command(
        'scopes',
        print.dim('Show the list scopes of current user'),
        (yarg) => yarg,
        wrapCommand(allScopes),
      )

      schild.command(
        'modules',
        print.dim('Show the list modules of current user'),
        (yarg) => yarg,
        wrapCommand(allModules),
      )

      showHelpIfInvalid(schild, schild.argv, 3, 4)
    })

    showHelpIfInvalid(child, child.argv, 2, 3)
  })

  yargs.command(
    'whoami',
    print.dim('Who I am? [alias: user-whoami]'),
    (yarg) => yarg,
    wrapCommand(whoami),
  )

  yargs.command(
    'login [username]',
    print.dim('Sign in to your user [alias: user-login]'),
    (yarg) =>
      yarg.option('registry', {
        describe: 'Specified the registry service want to sign in',
        type: 'string',
        required: false,
      }),
    wrapCommand(loginAsUser),
  )

  yargs.command(
    'logout [username]',
    print.dim('Sign out of this user [alias: user-logout]'),
    (yarg) => yarg,
    wrapCommand(logoutFromUser),
  )

  yargs.command(
    'register',
    print.dim('Create new user [alias: user-register]'),
    (yarg) => yarg,
    wrapCommand(createUser),
  )

  yargs.command(
    'use <username>',
    print.dim('Switch to another logged-in user [alias: user-use]'),
    (yarg) => yarg,
    wrapCommand(useAs),
  )
}
