import Worker from '../../classes/Worker'

import createQuestions from '../../utils/createQuestions'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

import loginAsUser from './loginAsUser'

const emailQuestion = {
  type: 'string',
  name: 'email',
  message: 'Email',
}

const nameQuestion = {
  type: 'string',
  name: 'name',
  message: 'Full name',
}

const usernameQuestion = {
  type: 'string',
  name: 'username',
  message: 'Username',
}

const passwordQuestion = {
  type: 'password',
  name: 'password',
  message: 'Password',
}

const verifyPasswordQuestion = {
  type: 'password',
  name: 'repassword',
  message: 'Verify password',
}

const autoLoginQuestion = {
  type: 'boolean',
  name: 'autoLogin',
  message: 'Auto login after successful creation?',
  default: true,
}

async function register() {
  const result = await createQuestions<{
    name: string
    email: string
    username: string
    password: string
    repassword: string
    autoLogin: boolean
  }>([
    emailQuestion,
    nameQuestion,
    usernameQuestion,
    passwordQuestion,
    verifyPasswordQuestion,
    autoLoginQuestion,
  ])
  const { email, name, username, password, repassword, autoLogin } = result

  if (!email || !name || !username || !password || !repassword) {
    throw new Error('Missing info to create user')
  }

  if (password !== repassword) {
    throw new Error('Password and verify password is not matched')
  }

  const tick = timer()
  await Worker.createUser({ email, name, username, password })
  info(`Successfully created ${print.name(username)} user account`)

  if (autoLogin) {
    info('Signing in to account...')
    await loginAsUser({ username, password } as any)
  } else {
    success(`Done in ${print.time(tick())}.`)
  }

  return true
}

export default register
