import Worker from '../../classes/Worker'
import createQuestions from '../../utils/createQuestions'
import print, { info, log } from '../../utils/print'

import * as questions from './lib/questions'
import loginAsUser from './loginAsUser'

async function register(): Promise<boolean> {
  const answers = await createQuestions<{
    name: string
    email: string
    username: string
    password: string
    repassword: string
    autoLogin: boolean
  }>([
    questions.email,
    questions.name,
    questions.username,
    questions.password,
    questions.verifyPassword,
    questions.autoLogin,
  ])

  const { email, name, username, password, repassword, autoLogin } = answers

  if (!email || !name || !username || !password || !repassword) {
    throw new Error('Not enough information to register for an account.')
  }

  if (password !== repassword) {
    throw new Error('Verification password is not correct.')
  }

  // Create a request to perform this action.
  await Worker.createUser({ email, name, username, password })

  info(`User ${print.name(username)} has been successfully registered!`)
  log()

  //
  if (autoLogin) {
    info('Signing in to the new user...')
    log()

    //
    await loginAsUser({ username, password } as any)
  }

  return true
}

export default register
