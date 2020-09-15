import Worker from '../../classes/Worker'
import createQuestions from '../../utils/createQuestions'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

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

  const tick = timer()

  //
  await Worker.createUser({ email, name, username, password })

  info(`Successfully created ${print.name(username)} user account`)
  if (autoLogin) {
    info('Signing in to account...')

    //
    await loginAsUser({ username, password } as any)
  } else {
    success(`Done in ${print.time(tick())}.`)
  }

  return true
}

export default register
