import { pick } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import { ConfigurationFields } from '../../types'
import print, { info, log, pretty } from '../../utils/print'

const CONFIGURATION_FIELDS = Object.values<string>(ConfigurationFields)

interface ConfigGetConfigOptions extends Arguments<{ keys: string[] }> {}

async function getConfig(options: ConfigGetConfigOptions): Promise<boolean> {
  const { keys } = options

  for (const key of keys) {
    if (!CONFIGURATION_FIELDS.includes(key)) {
      throw new Error(
        `Can't find the ${print.name(
          key,
        )} configuration field, please check again.`,
      )
    }
  }

  //
  const configuration = await Config.readConfiguration()
  const values = pick(configuration, keys)

  info('Current configuration information', pretty(values))
  log()

  return true
}

export default getConfig
