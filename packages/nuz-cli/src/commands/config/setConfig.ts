import { checkIsUrl } from '@nuz/utils'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import { ConfigurationFields } from '../../types'
import print, { success } from '../../utils/print'

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
    key === ConfigurationFields.static
  ) {
    if (!checkIsUrl(value)) {
      throw new Error(
        `${print.dim(value)} value set for field ${print.name(
          key,
        )} is not valid.`,
      )
    }

    const slash = key === ConfigurationFields.static ? '/' : ''
    configuration[key] = new URL(value).origin + slash
  } else {
    configuration[key] = value
  }

  //
  await Config.writeConfiguration(configuration)

  success(
    `Set ${print.bold(key)} value with ${print.bold(
      configuration[key],
    )} successfully!`,
  )

  return true
}

export default setConfig
