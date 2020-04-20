import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { linkedUrls } from '@nuz/utils'
import glob from 'glob'
import path from 'path'
import io from 'socket.io'
import * as webpack from 'webpack'

import { ModuleConfig } from '../../types'

import clearConsole from '../../utils/clearConsole'
import * as compilerName from '../../utils/compilerName'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import { exit, onExit } from '../../utils/process'
import runWatchMode from '../../utils/runWatchMode'
import serve from '../../utils/serve'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

import { Arguments } from 'yargs'
import * as logs from './logs'

const execute = async ({
  workspace: _workspace,
  port: _port,
}: Arguments<{ port: number; workspace: string[] }>) => {
  const shouldClean = true
  const moduleDir = paths.cwd

  const configIsExisted = _workspace ? true : configHelpers.exists(moduleDir)
  if (!configIsExisted) {
    logs.configIsNotFound()
    return exit(1)
  }

  const moduleConfig =
    configHelpers.extract(moduleDir, false) || ({} as ModuleConfig)
  if (!moduleConfig) {
    logs.configIsInvalid()
    return exit(1)
  }

  const workspace: string[] =
    _workspace || (moduleConfig && moduleConfig.workspace)
  if (!workspace) {
    logs.workspaceIsNotFound()
    return exit(1)
  }

  const { serve: serveConfig } = moduleConfig || {}

  const port = _port || 4000
  const linkedUrl = linkedUrls.modules(port)

  // Clear console and log to notify starting workspace mode
  clearConsole()
  logs.notifyOnStart()

  // Create build directory for worksapce
  const publicPath = `${linkedUrl.href}`

  const buildDir = paths.nuz(moduleDir, 'modules')
  fs.ensureDir(buildDir)
  if (shouldClean) {
    logs.cleanFolder(buildDir)

    await fs.emptyDir(buildDir)
  }

  // Check and get modules paths in workspace
  const workspacePaths = workspace.reduce<string[]>(
    (acc, item) => acc.concat(glob.sync(item)),
    [],
  )
  const validPaths = workspacePaths.filter((p) => p && configHelpers.exists(p))
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
    const webpackConfig = webpackConfigFactory(
      {
        dev: true,
        cache: true,
        module: moduleName,
        dir: realPath,
        config: configOfModule,
      },
      featureOfModule,
    )

    if (!webpackConfig.output) {
      throw new Error('Webpack output is not defined')
    }

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
  }, {} as { [name: string]: any })

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

  // Create server to serve file serving and directory listing in workspace
  const server = serve(
    Object.assign({}, serveConfig, {
      port,
      dir: buildDir,
    }),
  )

  const watchUrl = linkedUrls.watch(port)
  const store = { linkedModules: null as any }

  // Create socket to watching changes and reload
  const socket = io(server, {
    path: watchUrl.pathname,
    serveClient: false,
    cookie: false,
  })

  // Create socket helpers
  const emitOnChange = (modules: string[]) =>
    socket.emit(LINKED_CHANGE_EVENT, { modules })

  socket.on('connection', (client) => {
    const isReady = !!store.linkedModules
    client.emit(LINKED_DEFINE_EVENT, {
      ready: isReady,
      modules: store.linkedModules,
    })
  })

  // Build and watching modules
  const watcher = await runWatchMode(
    webpackConfigs,
    { clearConsole: false },
    ({ data }, { isFirstBuild }) => {
      const { children = [] } = data || {}

      const linkedModules = children.reduce((acc, item) => {
        const arrOutputPath = (item.outputPath as string).split('/')
        const name = arrOutputPath[arrOutputPath.length - 1]
        const moduleInfo = modulesConfig[name]
        if (!moduleInfo) {
          //
        }

        const moduleAssets = pickAssetsFromStats(item)
        const moduleResolve = {
          main: moduleAssets.main.url,
          styles: moduleAssets.styles.map((style) => style.url),
        }

        return Object.assign(acc, {
          [name]: {
            shared: moduleInfo.config.shared,
            library: moduleInfo.webpack.output.library,
            format: moduleInfo.webpack.output.libraryTarget,
            upstream: {
              host: 'self',
              resolve: moduleResolve,
            },
          },
        })
      }, {})
      store.linkedModules = linkedModules

      const changedModulesName = children.map((child) =>
        compilerName.extract((child as any).name),
      )
      emitOnChange(changedModulesName)
    },
  )

  onExit(() => {
    server.close()
  })

  return true
}

export const setCommands = (yargs) => {
  yargs.command(
    'workspace',
    'Run workspace development mode',
    (yarg) =>
      yarg
        .option('workspace', {
          describe:
            'Workspace to link local modules, set to override in file config',
          type: 'array',
          required: false,
        })
        .option('port', {
          describe: 'Set port listen for server',
          type: 'number',
          required: false,
        }),
    execute,
  )
}
