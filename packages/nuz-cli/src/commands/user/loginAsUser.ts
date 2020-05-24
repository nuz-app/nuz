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
  registry: _registry,
}: Arguments<{ username?: string; password?: string; registry?: string }>) {
  const placeholder = { username: _username, password: _password }

  const isFilled = !!(_username && _password)
  const result =
    !isFilled &&
    (await createQuestions<{ username: string; password: string }>(
      // @ts-ignore
      [!_username && usernameQuestion, !_password && passwordQuestion].filter(
        Boolean,
      ),
    ))
  const { username, password } = Object.assign(placeholder, result)

  if (!username || !password) {
    throw new Error('Missing `username` or `password` info')
  }

  let registry = _registry
  if (registry) {
    await setConfig({
      key: ConfigKeys.registry,
      value: registry,
    } as any)
  } else {
    const config = await Config.readConfig()
    registry = config[ConfigKeys.registry]
  }

  info(`Logging in to the registry server at ${print.bold(registry)}`)

  const tick = timer()
  const request = await Worker.loginAsUser(username, password)

  const userId = request?.data?._id
  const accessToken = request?.data?.accessToken
  const staticOrigin = request?.data?.static
  // const providedType = request?.data?.providedType

  if (!userId || !accessToken) {
    throw new Error(`Response data is missing data`)
  }

  await Config.create(username)
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
