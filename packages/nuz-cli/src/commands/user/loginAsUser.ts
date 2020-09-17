import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { AuthenticationFields, ConfigurationFields } from '../../types'
import createQuestions from '../../utils/createQuestions'
import print, { info, log } from '../../utils/print'
import setConfig from '../config/setConfig'

import * as questions from './lib/questions'

interface UserLoginAsUserOptions
  extends Arguments<{
    registry?: string
  }> {}

async function loginAsUser(options: UserLoginAsUserOptions): Promise<boolean> {
  const { registry: _registry } = options

  const { username, password } = await createQuestions<{
    username: string
    password: string
  }>([questions.username, questions.password].filter(Boolean) as any[])

  if (!username || !password) {
    throw new Error('Missing information to login.')
  }

  //
  const restore = Worker.backup()

  const registry =
    _registry ||
    (await Config.readConfiguration())[ConfigurationFields.registry]

  //
  await Worker.set({
    endpoint: registry,
  })

  info(`Logging in to the registry server at ${print.dim(registry)}.`)
  log()

  try {
    // Create a request to perform this action.
    const request = await Worker.loginAsUser(username as string, password)
    const userId = request?.data?._id
    const accessToken = request?.data?.accessToken
    const cdn = request?.data?.cdn
    // const providedType = request?.data?.providedType

    if (!userId || !accessToken) {
      throw new Error(
        'The received data is not correct, please try again later.',
      )
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
      value: cdn,
    } as any)

    //
    await setConfig({
      key: ConfigurationFields.registry,
      value: registry,
    } as any)

    info(`Successfully logged in to your ${print.name(username)} account.`)
    log()
  } catch (err) {
    restore()

    throw err
  }

  return true
}

export default loginAsUser
