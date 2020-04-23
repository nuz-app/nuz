import { UserAccessTokenTypes } from '@nuz/shared'

import User, { ConfigFields } from '../../classes/User'
import Worker from '../../classes/Worker'

import createQuestions from '../../utils/createQuestions'
import handleOnCommand from '../../utils/handleOnCommand'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

const getUsernameQuestion = () => ({
  type: 'string',
  name: 'username',
  message: `Username`,
  required: true,
})

const getPasswordQuestion = () => ({
  type: 'password',
  name: 'password',
  message: `Password`,
  required: true,
})

const loginAsUser = async () => {
  const answers = await createQuestions<{ username: string; password: string }>(
    [getUsernameQuestion(), getPasswordQuestion()],
  )
  const { username, password } = answers

  const formIsMissing = !username || !password
  if (formIsMissing) {
    throw new Error('Missing `username` or `password` info!')
  }

  const user = new User()
  await user.prepare()

  const registry = await user.getConfig(ConfigFields.registry)
  const worker = new Worker(registry)

  const result = await worker.login(
    username,
    password,
    UserAccessTokenTypes.fullAccess,
  )
  console.log({ result })
}

const noop = async () => {}

export const setCommands = (yargs) => {
  yargs.command('user', 'Manage user', (child) => {
    child.usage('usage: $0 user <item> [options]')

    child.command(
      'login',
      'Login as user in workspace',
      (yarg) => yarg,
      handleOnCommand(loginAsUser),
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
