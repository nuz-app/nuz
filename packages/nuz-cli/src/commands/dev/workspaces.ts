import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { linkedUrls } from '@nuz/utils'
import glob from 'glob'
import path from 'path'
import io from 'socket.io'
import * as webpack from 'webpack'
import { Arguments } from 'yargs'

import { ModuleConfig } from '../../types'

import clearConsole from '../../utils/clearConsole'
import * as compilerName from '../../utils/compilerName'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import print, { info, pretty } from '../../utils/print'
import { onExit } from '../../utils/process'
import runWatchMode from '../../utils/runWatchMode'
import serve from '../../utils/serve'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

async function standalone({
  workspaces,
  port = 4000,
}: Arguments<{ port?: number; workspaces: string[] }>) {
  const dir = paths.cwd

  const configIsExisted = workspaces || configHelpers.exists(dir)
  if (!configIsExisted) {
    throw new Error(
      'Not found a config file, file named `nuz.config.js` in root dir',
    )
  }

  const rootModuleConfig =
    configHelpers.extract(dir, false) || ({} as ModuleConfig)
  if (!rootModuleConfig) {
    throw new Error('Config file is invalid')
  }

  const { serve: serveConfig } = rootModuleConfig

  const linkedUrl = linkedUrls.modules(port)
  const publicPath = linkedUrl.href
  const bundlesDir = paths.configInDir(dir, 'modules')

  clearConsole()
  info('Clean up distributable workspaces folder')
  await fs.emptyDir(bundlesDir)

  // Check and get modules paths in workspace
  const workspacesPaths = workspaces.reduce<string[]>(
    (acc, item) => acc.concat(glob.sync(item)),
    [],
  )
  const validPaths = workspacesPaths.filter((p) => p && configHelpers.exists(p))
  const modulesConfig = validPaths.reduce((acc, item: string) => {
    // If path is empty or not found config, skip it!
    const moduleIsValid = item && configHelpers.exists(item)
    if (!moduleIsValid) {
      return acc
    }

    // Get real path and extract config
    const childModuleDir = fs.realpathSync(item)
    const childModuleConfig = configHelpers.extract(childModuleDir)
    if (!childModuleConfig) {
      throw new Error('Config file is invalid')
    }

    // Break if not having some important fields in module
    exitIfModuleInsufficient(childModuleConfig)
    const childFeatureConfig = getFeatureConfig(
      childModuleDir,
      childModuleConfig,
    )

    // Get module name
    const { name: childName, output } = childModuleConfig

    // Factory webpack config for module
    info(
      `Features config using in ${print.name(childName)}`,
      pretty(childFeatureConfig),
    )

    // Create dist info
    const distDir = path.join(bundlesDir, childName)
    const distFilename = path.basename(output)
    const distPublicPath = publicPath + childName + '/'

    // Create webpack config
    const childWebpackConfig = webpackConfigFactory(
      {
        dev: true,
        cache: true,
        module: childName,
        dir: childModuleDir,
        config: Object.assign(childModuleConfig, {
          publicPath: distPublicPath,
          output: path.join(distDir, distFilename),
        }),
      },
      childFeatureConfig,
    )

    if (!childWebpackConfig.output) {
      throw new Error('Webpack output is not defined')
    }

    // Create module info
    const moduleInfo = {
      distFile: path.join(distDir, distFilename),
      dir: childModuleDir,
      config: childModuleConfig,
      feature: childFeatureConfig,
      webpack: childWebpackConfig,
    }

    // Merge with other modules config
    return Object.assign(acc, { [childName]: moduleInfo })
  }, {} as { [name: string]: any })

  const modulesConfigKeys = Object.keys(modulesConfig)
  info(`Found ${print.bold(modulesConfigKeys.length)} module(s) in workspaces`)
  info('Linking module(s)', modulesConfigKeys)

  const webpackConfigs: webpack.Configuration[] = modulesConfigKeys.map(
    (moduleName: string) => {
      const moduleInfo = modulesConfig[moduleName]

      // Push webpack config
      return moduleInfo.webpack
    },
  )

  // Create server to serve file serving and directory listing in workspace
  const server = serve(
    Object.assign({}, serveConfig, {
      port,
      dir: bundlesDir,
    }),
  )

  const watchUrl = linkedUrls.watch(port)
  const definedModules = {}

  // Create socket to watching changes and reload
  const socket = io(server, {
    path: watchUrl.pathname,
    serveClient: false,
    cookie: false,
  })

  // Create socket helpers
  const emitOnChange = (changes: string[]) =>
    socket.emit(LINKED_CHANGE_EVENT, { changes })

  // Fired a callback on connection event
  socket.on('connection', (client) =>
    client.emit(LINKED_DEFINE_EVENT, {
      modules: definedModules,
    }),
  )

  // Build and watching modules
  const watcher = await runWatchMode(
    webpackConfigs,
    { clearConsole: true },
    ({ data }) => {
      const { children = [] } = data || {}

      const linkedModules = children.reduce((acc, item) => {
        const outputPaths = (item.outputPath as string).split('/')
        const name = outputPaths[outputPaths.length - 1]
        const childModuleInfo = modulesConfig[name]
        if (!childModuleInfo) {
          throw Error(`Not found config of ${name} module`)
        }

        const childModuleAssets = pickAssetsFromStats(item)
        const childModuleUpstreamResolve = {
          main: childModuleAssets.resolve.main.url,
          styles: childModuleAssets.resolve.styles.map((style) => style.url),
        }

        return Object.assign(acc, {
          [name]: {
            shared: childModuleInfo.config.shared,
            library: childModuleInfo.webpack.output.library,
            format: childModuleInfo.webpack.output.libraryTarget,
            upstream: childModuleUpstreamResolve,
          },
        })
      }, {})

      Object.assign(definedModules, linkedModules)

      const changedModulesName = children.map((child) =>
        compilerName.extract((child as any).name),
      )
      emitOnChange(changedModulesName)
    },
  )

  onExit(() => {
    server.close()
  })

  return false
}

export default standalone
