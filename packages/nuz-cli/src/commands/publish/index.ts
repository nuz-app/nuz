import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import { Argv } from 'yargs'

import { STATS_FILENAME } from '../../lib/const'
import { CommandConfig, CommandTypes } from '../../types/common'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import { exit } from '../../utils/process'

import * as logs from './logs'
import publish from './publish'

// @ts-ignore
const execute = async ({ clean }: Argv<{ clean: true }>) => {
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

  const { name, version, output, library, publishConfig } = moduleConfig

  clearConsole()
  logs.notifyOnStart(name, version)

  const distPath = path.join(moduleDir, path.dirname(output))
  if (!fs.exists(distPath)) {
    logs.distIsNotFound(distPath)
    return exit(1)
  }

  const statsPath = path.join(distPath, STATS_FILENAME)
  if (!fs.exists(statsPath)) {
    logs.statsIsNotFound(statsPath)
    return exit(1)
  }

  const stats = await fs.readJson(statsPath)
  const { publicPath, entrypoints } = stats
  const { assets } = entrypoints.main

  const transformAsset = (filename: string) => ({
    url: publicPath + filename,
    integrity: integrityHelpers.file(path.join(distPath, filename)),
  })

  const main = transformAsset(assets.find(item => /\.js$/.test(item)))
  const styles = assets.filter(item => /\.css$/.test(item)).map(transformAsset)
  const resolve = {
    main,
    styles,
  }

  try {
    await publish(publishConfig, {
      name,
      version,
      library,
      resolve,
    })
  } catch (error) {
    logs.publishFailed(error)
    return exit(1)
  }

  logs.publishedIsDone(name, version)

  return exit(0)
}

const config: CommandConfig<{}> = {
  type: CommandTypes.publish,
  description: 'Publish version for module',
  transform: yargs => yargs,
  execute,
}

export default config
