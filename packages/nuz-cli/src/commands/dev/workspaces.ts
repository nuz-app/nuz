import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { linkedUrls, moduleIdHelpers } from '@nuz/utils'
import glob from 'glob'
import path from 'path'
import clearConsole from 'react-dev-utils/clearConsole'
import openBrowser from 'react-dev-utils/openBrowser'
import io from 'socket.io'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkRequiredModuleConfig from '../../utils/checkRequiredModuleConfig'
import * as compilerName from '../../utils/compilerName'
import * as configHelpers from '../../utils/configHelpers'
import ensurePath from '../../utils/ensurePath'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import getModuleAssetsOnly from '../../utils/getModuleAssetsOnly'
import print, { info, pretty } from '../../utils/print'
import { onExit } from '../../utils/process'
import runWatchMode from '../../utils/runWatchMode'
import serve from '../../utils/serve'
import webpackConfigFactory from '../../utils/webpack/factories/buildConfig'

async function standalone({
  workspaces,
  port = 4000,
  open = true,
}: Arguments<{ port?: number; workspaces: string[]; open?: boolean }>) {
  const dir = paths.cwd

  if (!workspaces) {
    throw new Error(
      'Provide `workspaces` field to starts workspaces development mode',
    )
  }

  const linkedUrl = linkedUrls.modules(port)
  const publicPath = linkedUrl.href
  const bundlesDirectory = paths.bundlesDirectory(dir, 'modules')

  clearConsole()
  await fs.emptyDir(bundlesDirectory)

  // Check and get modules paths in workspace
  const selectedWorkspaces = workspaces.reduce<string[]>(
    (acc, item) => acc.concat(glob.sync(item)),
    [],
  )
  const modulesValidPaths = selectedWorkspaces.filter(
    (p) => p && configHelpers.exists(p),
  )
  const modulesConfig = modulesValidPaths.reduce((acc, item: string) => {
    // If path is empty or not found config, skip it!
    const moduleIsValid = item && configHelpers.exists(item)
    if (!moduleIsValid) {
      return acc
    }

    // Get real path and extract config
    const moduleDirectory = fs.realpathSync(item)
    const moduleConfig = configHelpers.extract(moduleDirectory)
    if (!moduleConfig) {
      throw new Error('Config file is invalid')
    }

    // Break if not having some important fields in module
    checkRequiredModuleConfig(moduleConfig)
    const featuresOf = getFeatureConfig(moduleDirectory, moduleConfig)
    const { name: moduleName, output: currentOutput } = moduleConfig

    // Create output directory inside bundles directory
    const moduleCurrentOutputs = ensurePath(moduleDirectory, currentOutput)
    const moduleOutputDirectory = path.join(bundlesDirectory, moduleName)
    const moduleOutputFile = path.join(
      moduleOutputDirectory,
      moduleCurrentOutputs.filename,
    )
    const modulePublicPath = `${publicPath}${moduleName}/`

    // Create webpack config
    const webpackConfig = webpackConfigFactory(
      {
        dev: true,
        cache: true,
        module: moduleName,
        dir: moduleDirectory,
        config: Object.assign({}, moduleConfig, {
          publicPath: modulePublicPath,
          output: moduleOutputFile,
        }),
      },
      featuresOf,
    )

    if (!webpackConfig.output) {
      throw new Error('An error occurred during config creation')
    }

    // Factory webpack config for module
    info(
      `Features config using in ${print.name(moduleName)}`,
      pretty(featuresOf),
    )

    // Merge with other modules config
    return Object.assign(acc, {
      [moduleName]: {
        featuresOf,
        dir: moduleDirectory,
        config: moduleConfig,
        webpack: webpackConfig,
      },
    })
  }, {} as { [name: string]: any })

  const modulesName = Object.keys(modulesConfig)
  const multiWebpackConfig = modulesName.map(
    (moduleName: string) => modulesConfig[moduleName].webpack,
  )

  info(`Found ${print.bold(modulesName.length)} module(s) in workspaces`)
  info('Linking module(s)', modulesName)

  const allModules = {}
  const watchUrl = linkedUrls.watch(port)

  // Create server to serve file serving and directory listing in workspace
  const server = serve({
    port,
    dir: bundlesDirectory,
  })

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
  socket.on('connection', function connection(client) {
    client.emit(LINKED_DEFINE_EVENT, {
      modules: allModules,
    })
  })

  runWatchMode(
    multiWebpackConfig,
    { clearConsole: true },
    ({ data }, { firstTime }) => {
      const { children = [] } = data || {}

      const bundledModules = children.reduce((acc, item) => {
        const moduleName = item.name?.replace(
          /^(@nuz\/cli\(([\S\s]+)\))/,
          '$2',
        ) as string
        const moduleData = modulesConfig[moduleName]
        if (!moduleData) {
          throw Error(`Can't get module data of ${moduleName}`)
        }

        const moduleAssets = getModuleAssetsOnly(item, { md5sum: false })
        const moduleResolve = {
          main: moduleAssets.resolve.main.url,
          styles: moduleAssets.resolve.styles.map((style) => style.url),
        }
        const moduleId = moduleIdHelpers.use(moduleName)

        return Object.assign(acc, {
          [moduleId]: {
            shared: moduleData.config.shared,
            library: moduleData.webpack.output.library,
            format: moduleData.webpack.output.libraryTarget,
            upstream: moduleResolve,
          },
        })
      }, {})

      Object.assign(allModules, bundledModules)

      const changedModuleIds = children.map((child) =>
        moduleIdHelpers.use(compilerName.extract((child as any).name)),
      )
      emitOnChange(changedModuleIds)

      if (firstTime && open) {
        openBrowser(publicPath)
      }
    },
  )

  onExit(() => {
    server.close()
  })

  return false
}

export default standalone
