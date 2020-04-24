import Config, { AuthKeys } from '../../classes/Config'
import Worker from '../../classes/Worker'

import { Arguments } from 'yargs'
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

async function login({
  username: _username,
  password: _password,
}: Arguments<{ username: string; password: string }>) {
  const isFilled = _username && _password
  const result = isFilled
    ? { username: _username, password: _password }
    : await createQuestions<{ username: string; password: string }>([
        usernameQuestion,
        passwordQuestion,
      ])
  const { username, password } = result

  if (!username || !password) {
    throw new Error('Missing `username` or `password` info')
  }

  const request = await Worker.loginAsUser(username, password)

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

  success(`Login successfully to ${print.name(username)} account!`)
  return true
}

export default login
