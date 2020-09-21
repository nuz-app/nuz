import Table from 'cli-table'

import Config from '../../classes/Config'
import { AuthenticationFields, ConfigurationFields } from '../../types'
import formatLoggedAt from '../../utils/formatLoggedAt'
import { info, log } from '../../utils/print'

async function listUsers(): Promise<boolean> {
  //
  const users = await Config.getUsersLogged()

  //
  const table = new Table({
    head: ['Id', 'Username', 'Logged', 'Registry Endpoint', 'Registry Type'],
  })

  //
  table.push(
    ...Object.values(users).map((user: any) => [
      user[AuthenticationFields.id],
      user[AuthenticationFields.username],
      formatLoggedAt(user[AuthenticationFields.loggedAt]),
      user.configuration[ConfigurationFields.registry] ?? '-',
      user.configuration[ConfigurationFields.storageType] ?? '-',
    ]),
  )

  info('List of available users')
  log(table.toString())
  log()

  return true
}

export default listUsers
