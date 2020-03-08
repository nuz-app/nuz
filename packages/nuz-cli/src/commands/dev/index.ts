import { Argv } from 'yargs'

import { CommandConfig, CommandTypes, DevConfig } from '../../types/common'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import getBundleInfo from '../../utils/getBundleInfo'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'
import * as webpackCompiler from '../../utils/webpackCompiler'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

import * as logs from './logs'

// @ts-ignore
const execute = async ({ port: _port }: Argv<DevConfig>) => {
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

  exitIfModuleInsufficient(moduleConfig)

  const { name } = moduleConfig

  const featureConfig = getFeatureConfig(moduleDir, moduleConfig)

  clearConsole()
  logs.notifyOnStart(name)

  logs.enableFeatures(featureConfig)

  const buildConfig = webpackConfigFactory(
    {
      dev: true,
      cache: true,
      dir: moduleDir,
      config: moduleConfig,
    },
    featureConfig,
  )

  let isFirstTimes = true

  const watcher = await webpackCompiler.watch(buildConfig, (error, stats) => {
    if (!isFirstTimes) {
      clearConsole()
    } else {
      isFirstTimes = false
    }

    if (error) {
      logs.buildFailed(error)
      return
    }

    const bundleInfo = getBundleInfo(stats)
    if (!bundleInfo.done) {
      logs.showErrorsAndWarnings(bundleInfo)
      return
    }

    const buildTime = stats.endTime - stats.startTime
    logs.waitingForChanges(buildTime)
  })

  const port = _port || 4000
  const server = serve({
    port,
    dir: buildConfig.output.path,
  })

  const host = `http://localhost:${port}/${buildConfig.output.filename}`

  logs.guide({
    host,
    port,
    name: moduleConfig.name,
    library: moduleConfig.library,
  })

  onExit(() => {
    server.close()
  })

  return true
}

const config: CommandConfig = {
  type: CommandTypes.dev,
  description: 'Run development mode',
  transform: yargs =>
    yargs.option('port', {
      alias: 'p',
      describe: 'Port to bind on',
      type: 'number',
      required: false,
    }),
  execute,
}

export default config
