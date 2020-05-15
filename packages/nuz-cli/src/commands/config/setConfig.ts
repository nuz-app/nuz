import { checkIsUrl } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config, { ConfigKeys } from '../../classes/Config'

import print, { success } from '../../utils/print'

const keysAllowToSet = Object.values<string>(ConfigKeys)

async function setConfig({
  key,
  value,
}: Arguments<{ key: string; value: string }>) {
  const config = await Config.readConfig()

  const keyIsInvalid = !keysAllowToSet.includes(key)
  if (keyIsInvalid) {
    throw new Error(`Can't set ${key} to config because key is invalid`)
  }

  if (key === ConfigKeys.registry || key === ConfigKeys.static) {
    if (!checkIsUrl(value)) {
      throw new Error(`Can't set value because it is invalid, value ${value}`)
    }

    const slash = key === ConfigKeys.static ? '/' : ''
    config[key] = new URL(value).origin + slash
  } else {
    config[key] = value
  }

  await Config.writeConfig(config)

  success(
    `Set ${print.bold(key)} value with ${print.bold(
      config[key],
    )} successfully!`,
  )
  return true
}

export default setConfig
