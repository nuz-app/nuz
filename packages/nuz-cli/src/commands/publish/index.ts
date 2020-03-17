import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import * as yargs from 'yargs'

import { STATS_FILENAME } from '../../lib/const'
import { CommandConfig, CommandTypes, PublishCommand } from '../../types/common'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import { exit } from '../../utils/process'

import * as logs from './logs'
import publish from './publish'

// @ts-ignore
const execute = async ({ fallback }: yargs.Argv<PublishCommand>) => {
  const moduleDir = paths.cwd

  const configIsExisted = configHelpers.exists(moduleDir)
  if (!configIsExisted) {
    logs.configIsNotFound()
    return exit(1)
  }

  const moduleConfig = configHelpers.extract(moduleDir)
  if (!moduleConfig) {
    logs.configIsInvalid()
    return exit(1)
  }

  const { name, version, output, library, registry } = moduleConfig

  if (!registry.token || !registry.endpoint) {
    logs.registryConfigIsInvalid()
    return exit(1)
  }

  clearConsole()
  logs.notifyOnStart(name, version)

  const distPath = path.join(moduleDir, path.dirname(output))
  if (!fs.exists(distPath)) {
    logs.distIsNotFound(distPath)
    return exit(1)
  }

  logs.moduleIsPushling()

  const statsPath = path.join(distPath, STATS_FILENAME)
  if (!fs.exists(statsPath)) {
    logs.statsIsNotFound(statsPath)
    return exit(1)
  }

  const stats = await fs.readJson(statsPath)
  const resolve = pickAssetsFromStats(stats, { useIntegrity: true })

  let result
  try {
    result = await publish(
      registry,
      {
        name,
        version,
        library,
        resolve,
      },
      { fallback },
    )
  } catch (error) {
    logs.publishFailed(error)
    return exit(1)
  }

  const { name: _name, updated, tags, updatedAt } = result.data
  logs.publishedIsDone(name, version, { name: _name, updated, tags, updatedAt })

  return exit(0)
}

const config: CommandConfig<{}> = {
  type: CommandTypes.publish,
  description: 'Publish version for module',
  transform: yarg =>
    yarg.option('fallback', {
      alias: 'f',
      describe: 'Set fallback for new version',
      default: true,
      required: true,
    }),
  execute,
}

export default config
