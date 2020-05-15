import Config, { AuthKeys, ConfigKeys } from '../../classes/Config'
import Worker from '../../classes/Worker'

import { Arguments } from 'yargs'
import createQuestions from '../../utils/createQuestions'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

import setConfig from '../config/setConfig'

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

async function loginAsUser({
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

  const config = await Config.readConfig()
  info(
    `Logging in to the registry server at ${print.bold(
      config[ConfigKeys.registry],
    )}`,
  )

  const tick = timer()
  const request = await Worker.loginAsUser(username, password)

  const userId = request?.data?._id
  const accessToken = request?.data?.accessToken
  const staticOrigin = request?.data?.static
  const providedType = request?.data?.providedType

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
  auth[AuthKeys.loggedAt] = new Date()

  await Config.writeAuth(auth)

  await setConfig({
    key: ConfigKeys.static,
    value: staticOrigin,
  } as any)

  info(`Login successfully to ${print.name(username)} account!`)
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default loginAsUser
