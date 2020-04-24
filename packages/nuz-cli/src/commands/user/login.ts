import { UserAccessTokenTypes } from '@nuz/shared'

import Config, { AuthKeys } from '../../classes/Config'
import Worker from '../../classes/Worker'

import createQuestions from '../../utils/createQuestions'
import print, { success } from '../../utils/print'

const usernameQuestion = {
  type: 'string',
  name: 'username',
  message: `Username`,
}

const passwordQuestion = {
  type: 'password',
  name: 'password',
  message: `Password`,
}

async function login() {
  const result = await createQuestions<{ username: string; password: string }>([
    usernameQuestion,
    passwordQuestion,
  ])
  const { username, password } = result

  if (!username || !password) {
    throw new Error('Missing `username` or `password` info')
  }

  const request = await Worker.login(
    username,
    password,
    UserAccessTokenTypes.fullAccess,
  )
  const accessToken = request?.data?.accessToken
  if (!accessToken) {
    throw new Error(`Not found access token in response`)
  }

  const isNew = await Config.create(username)
  await Config.use(username)

  const auth = await Config.readAuth()
  auth[AuthKeys.token] = accessToken.value
  auth[AuthKeys.type] = accessToken.type

  await Config.writeAuth(auth)

  success(`Login successfully to ${print.bold(username)} account!`)
  return true
}

export default login
