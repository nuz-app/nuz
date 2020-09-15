import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { AuthenticationFields, ConfigurationFields } from '../../types'
import createQuestions from '../../utils/createQuestions'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'
import setConfig from '../config/setConfig'

import * as questions from './lib/questions'

interface UserLoginAsUserOptions
  extends Arguments<{
    username?: string
    password?: string
    registry?: string
  }> {}

async function loginAsUser(options: UserLoginAsUserOptions): Promise<boolean> {
  const {
    username: _username,
    password: _password,
    registry: _registry,
  } = options

  const isFilled = !!(_username && _password)
  const answers =
    !isFilled &&
    (await createQuestions<{ username: string; password: string }>(
      [
        !_username && questions.username,
        !_password && questions.password,
      ].filter(Boolean) as any[],
    ))
  const { username, password } = Object.assign(
    { username: _username, password: _password },
    answers,
  )

  if (!username || !password) {
    throw new Error('Missing information to login.')
  }

  const isUseNewRegistry = !_registry
  let registry = _registry

  //
  if (!isUseNewRegistry) {
    await setConfig({
      key: ConfigurationFields.registry,
      value: registry,
    } as any)
  }

  //
  if (isUseNewRegistry) {
    const configuration = await Config.readConfiguration()
    registry = configuration[ConfigurationFields.registry]
  }

  info(`Logging in to the registry server at ${print.bold(registry)}`)

  const tick = timer()

  //
  const request = await Worker.loginAsUser(username as string, password)
  const userId = request?.data?._id
  const accessToken = request?.data?.accessToken
  const staticOrigin = request?.data?.static
  // const providedType = request?.data?.providedType

  if (!userId || !accessToken) {
    throw new Error('The received data is not correct, please try again later.')
  }

  //
  await Config.create(username)

  //
  await Config.use(username)

  //
  const authentication = await Config.readAuthentication()
  authentication[AuthenticationFields.id] = userId
  authentication[AuthenticationFields.username] = username
  authentication[AuthenticationFields.token] = accessToken.value
  authentication[AuthenticationFields.type] = accessToken.type
  authentication[AuthenticationFields.loggedAt] = new Date()

  //
  await Config.writeAuthentication(authentication)

  //
  await setConfig({
    key: ConfigurationFields.static,
    value: staticOrigin,
  } as any)

  info(`Login successfully to ${print.name(username)} account!`)
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default loginAsUser
