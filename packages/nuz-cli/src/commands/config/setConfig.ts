import { checkIsUrl } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import { ConfigurationFields } from '../../types'
import print, { log, success, warn } from '../../utils/print'

const CONFIGURATION_FIELDS = Object.values<string>(ConfigurationFields)

interface ConfigSetConfigOptions
  extends Arguments<{ key: string; value: string }> {}

async function setConfig(options: ConfigSetConfigOptions): Promise<boolean> {
  const { key, value } = options

  //
  const configuration = await Config.readConfiguration()

  if (!CONFIGURATION_FIELDS.includes(key)) {
    throw new Error(
      `Can't find the ${print.name(
        key,
      )} configuration field, please check again.`,
    )
  }

  if (
    key === ConfigurationFields.registry ||
    key === ConfigurationFields.cdn
  ) {
    if (!checkIsUrl(value)) {
      throw new Error(
        `${print.dim(value)} value set for field ${print.name(
          key,
        )} is not valid.`,
      )
    }

    const slash = key === ConfigurationFields.cdn ? '/' : ''
    configuration[key] = new URL(value).origin + slash
  } else {
    configuration[key] = value
  }

  if (key === ConfigurationFields.registry) {
    warn(
      `Change ${ConfigurationFields.registry} field can have many other effects.`,
    )
    log()
  }

  //
  await Config.writeConfiguration(configuration)

  success(
    `Updated ${print.dim(key)} field with ${print.dim(
      configuration[key],
    )} value successfully.!`,
  )
  log()

  return true
}

export default setConfig
