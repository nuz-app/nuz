import { pick } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config, { ConfigKeys } from '../../classes/Config'

import { pretty, info } from '../../utils/print'

const keysAllowToSet = Object.values<string>(ConfigKeys)

async function getConfig({ keys }: Arguments<{ keys: string[] }>) {
  for (const key of keys) {
    const keyIsInvalid = !keysAllowToSet.includes(key)
    if (keyIsInvalid) {
      throw new Error(`Can't get value of ${key} because key is invalid`)
    }
  }

  const config = await Config.readConfig()
  const values = pick(config, keys)

  info(pretty(values))
  return true
}

export default getConfig
