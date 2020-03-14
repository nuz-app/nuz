import { linkedUrls } from '@nuz/utils'
import glob from 'glob'
import path from 'path'
import * as webpack from 'webpack'
import * as yargs from 'yargs'

import { CommandConfig, CommandTypes, WorkspaceCommand } from '../../types'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'
import startWatchMode from '../../utils/startWatchMode'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

import * as logs from './logs'

const execute = async ({
  // @ts-ignore
  workspace: _workspace,
  // @ts-ignore
  port: _port,
}: yargs.Argv<WorkspaceCommand>) => {
  const moduleDir = paths.cwd

  const configIsExisted = configHelpers.exists(moduleDir)
  if (!configIsExisted) {
    logs.configIsNotFound()
    return exit(1)
  }

  const moduleConfig = configHelpers.extract(moduleDir, false)
  if (!moduleConfig) {
    logs.configIsInvalid()
    return exit(1)
  }

  const workspace: string[] = _workspace || moduleConfig.workspace
  if (!workspace) {
    logs.workspaceIsNotFound()
    return exit(1)
  }

  const port = _port || 4000
  const linkedUrl = linkedUrls.modules(port)

  // Clear console and log to notify starting workspace mode
  clearConsole()
  logs.notifyOnStart()

  // Create build directory for worksapce
  const buildDir = paths.nuz(moduleDir, 'modules')
  const publicPath = linkedUrl + '/'
  fs.ensureDir(buildDir)

  // Check and get modules paths in workspace
  const workspacePaths = workspace.reduce<string[]>(
    (acc, item) => acc.concat(glob.sync(item)),
    [],
  )
  const validPaths = workspacePaths.filter(p => p && configHelpers.exists(p))
  const modulesConfig = validPaths.reduce((acc, modulePath: string) => {
    // If path is empty or not found config, skip it!
    const moduleIsValid = modulePath && configHelpers.exists(modulePath)
    if (!moduleIsValid) {
      return acc
    }

    // Get real path and extract config
    const realPath = fs.realpathSync(modulePath)
    const configOfModule = configHelpers.extract(realPath)
    if (!configOfModule) {
      logs.moduleConfigIsInvalid(realPath)
      return exit(1)
    }

    // Get module name
    const moduleName = configOfModule.name

    // Break if not having some important fields in module
    exitIfModuleInsufficient(configOfModule)
    const featureOfModule = getFeatureConfig(realPath, configOfModule)

    // Factory webpack config for module
    const webpackConfig: webpack.Configuration = webpackConfigFactory(
      {
        dev: true,
        cache: true,
        module: moduleName,
        dir: realPath,
        config: configOfModule,
      },
      featureOfModule,
    )

    // Create dist info
    const distDir = path.join(buildDir, moduleName)
    const distFilename = 'index.js'

    // Override webpack config with new dist info
    webpackConfig.output.path = distDir
    webpackConfig.output.filename = distFilename
    webpackConfig.output.publicPath = publicPath + moduleName + '/'

    // Create module info
    const moduleInfo = {
      dir: realPath,
      distFile: path.join(distDir, distFilename),
      config: configOfModule,
      feature: featureOfModule,
      webpack: webpackConfig,
    }

    // Merge with other modules config
    return Object.assign(acc, { [moduleName]: moduleInfo })
  }, {})

  const modulesKeys = Object.keys(modulesConfig)
  logs.workspaceIsBuilding(modulesKeys)

  const webpackConfigs: webpack.Configuration[] = modulesKeys.map(
    (moduleName: string) => {
      const moduleInfo = modulesConfig[moduleName]

      // Log info of module
      logs.moduleConfigIsFactoring(moduleInfo)

      // Push webpack config
      return moduleInfo.webpack
    },
  )

  // Build and watching modules
  const watcher = await startWatchMode(webpackConfigs)

  // Create server to serve file serving and directory listing in workspace
  const server = serve({
    port,
    dir: buildDir,
  })

  onExit(() => {
    server.close()
  })

  return true
}

const config: CommandConfig<{}> = {
  type: CommandTypes.workspace,
  description: 'Start development mode in workspace',
  transform: yarg =>
    yarg
      .option('workspace', {
        alias: 'w',
        describe:
          'Workspace to link local modules, set to override in file config',
        type: 'array',
        required: false,
      })
      .option('port', {
        alias: 'p',
        describe: 'Set port listen for server',
        type: 'number',
        required: false,
      }),
  execute,
}

export default config
