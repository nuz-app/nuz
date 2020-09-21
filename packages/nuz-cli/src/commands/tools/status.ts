import { checkIsUrlOk } from '@nuz/utils'
import Table from 'cli-table'

import Config from '../../classes/Config'
import { AuthenticationFields, ConfigurationFields } from '../../types'
import checkIsOnline from '../../utils/checkIsOnline'
import formatLoggedAt from '../../utils/formatLoggedAt'
import print, { info, log } from '../../utils/print'

async function status(): Promise<boolean> {
  const isOnline = await checkIsOnline()

  const authentication = await Config.readAuthentication()
  const configuration = await Config.readConfiguration()

  const localTable = new Table()
  const isLogged = !!authentication[AuthenticationFields.token]
  localTable.push(
    {
      Is: isLogged
        ? print.blue(authentication[AuthenticationFields.username])
        : 'Not logged in',
    },
    {
      Logged: isLogged
        ? formatLoggedAt((authentication as any)[AuthenticationFields.loggedAt])
        : '-',
    },
    { Internet: isOnline ? print.green('Online') : 'Offline' },
  )

  const registryTable = new Table()
  const registryUrl = configuration[ConfigurationFields.registry]
  const registryIsOk = await checkIsUrlOk(registryUrl)
  registryTable.push(
    { Endpoint: registryUrl },
    { Type: configuration[ConfigurationFields.storageType] ?? '-' },
    { Status: registryIsOk ? print.green('Online') : print.red('Offline') },
  )

  log()
  info('Local information')
  log(localTable.toString())
  log()

  info('Registry information')
  log(registryTable.toString())
  log()

  return true
}

export default status
