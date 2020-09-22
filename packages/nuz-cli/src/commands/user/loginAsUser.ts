import { StorageTypes } from '@nuz/shared'
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
    username?: string
    password?: string
    force?: boolean
  }> {}

async function loginAsUser(options: UserLoginAsUserOptions): Promise<boolean> {
  const {
    registry: _registry,
    username: _username,
    password: _password,
    force,
  } = Object.assign({ force: false }, options)

  const { username, password } =
    _username && _password
      ? { username: _username, password: _password }
      : await createQuestions<{
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
    const storageType = request?.data?.storageType

    if (!userId || !accessToken) {
      throw new Error(
        'The received data is not correct, please try again later.',
      )
    }

    log()

    //
    const isCreated = await Config.create(username)

    // Is created `false` mean username is eixsted
    if (!isCreated && !force) {
      const configuration = await Config.readConfiguration()

      //
      if (configuration[ConfigurationFields.registry] === registry) {
        info('This user already exists, reused this working directory.')
        log()
      }
    }

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

    const isNotSelfHosted = storageType === StorageTypes.provided
    if (isNotSelfHosted) {
      //
      await setConfig({
        key: ConfigurationFields.cdn,
        value: cdn,
      } as any)
    }

    //
    await setConfig({
      key: ConfigurationFields.storageType,
      value: storageType,
    } as any)

    //
    await setConfig({
      key: ConfigurationFields.registry,
      value: registry,
    } as any)

    info(`Successfully logged in to your ${print.name(username)} account.`)
    log()
  } catch (err) {
    await restore()

    throw err
  }

  return true
}

export default loginAsUser
