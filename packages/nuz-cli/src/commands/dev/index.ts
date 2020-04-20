import path from 'path'
import { Arguments } from 'yargs'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import runWatchMode from '../../utils/runWatchMode'
import serve from '../../utils/serve'
import * as webpackCompiler from '../../utils/webpackCompiler'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

import * as logs from './logs'

const execute = async ({ port: _port }: Arguments<{ port: number }>) => {
  const shouldClean = true
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
  const { name, output, serve: serveConfig } = moduleConfig

  const featureConfig = getFeatureConfig(moduleDir, moduleConfig)

  clearConsole()
  logs.notifyOnStart(name)

  logs.enableFeatures(featureConfig)
  if (shouldClean) {
    const distPath = path.join(moduleDir, path.dirname(output))
    logs.cleanFolder(distPath)

    await fs.emptyDir(distPath)
  }

  const buildConfig = webpackConfigFactory(
    {
      dev: true,
      cache: true,
      dir: moduleDir,
      config: moduleConfig,
    },
    featureConfig,
  )

  const watcher = await runWatchMode(
    buildConfig as webpackCompiler.AllowWebpackConfig,
  )
  const port = _port || 4000
  const server = serve(
    Object.assign({}, serveConfig, {
      port,
      dir: buildConfig.output.path as string,
    }),
  )

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

export const setCommands = (yargs) => {
  yargs.command(
    'dev',
    'Run standalone development mode',
    (yarg) =>
      yarg.option('port', {
        describe: 'Set port listen for server',
        type: 'number',
        required: false,
      }),
    execute,
  )
}
