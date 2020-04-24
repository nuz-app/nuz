import { UserAccessTokenTypes } from '@nuz/shared'

import Config, { AuthKeys } from '../../classes/Config'
import Worker from '../../classes/Worker'

import createQuestions from '../../utils/createQuestions'
import print, { success } from '../../utils/print'

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

  const userId = request?.data?._id
  const accessToken = request?.data?.accessToken
  if (!userId || !accessToken) {
    throw new Error(`Response data is missing data`)
  }

  const isNew = await Config.create(username)
  await Config.use(username)

  const auth = await Config.readAuth()
  auth[AuthKeys.id] = userId
  auth[AuthKeys.username] = username
  auth[AuthKeys.token] = accessToken.value
  auth[AuthKeys.type] = accessToken.type

  await Config.writeAuth(auth)

  success(`Login successfully to ${print.bold(username)} account!`)
  return true
}

export default login
