import * as yargs from 'yargs'

import { CommandConfig, CommandTypes, DevCommand } from '../../types'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'
import runWatchMode from '../../utils/runWatchMode'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

import * as logs from './logs'

// @ts-ignore
const execute = async ({ port: _port }: yargs.Argv<DevCommand>) => {
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

  const watcher = await runWatchMode(buildConfig)
  const port = _port || 4000
  const server = serve({
    port,
    dir: buildConfig.output.path,
  })

  const upstreamUrl = `http://localhost:${port}/${buildConfig.output.filename}`
  logs.guide({
    upstream: upstreamUrl,
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
  transform: yarg =>
    yarg.option('port', {
      alias: 'p',
      describe: 'Set port listen for server',
      type: 'number',
      required: false,
    }),
  execute,
}

export default config
