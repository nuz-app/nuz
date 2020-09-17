import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { internalUrlsCreators, moduleIdHelpers } from '@nuz/utils'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import clearConsole from 'react-dev-utils/clearConsole'
import ignoredFiles from 'react-dev-utils/ignoredFiles'
import openBrowser from 'react-dev-utils/openBrowser'
import { createCompiler } from 'react-dev-utils/WebpackDevServerUtils'
import io from 'socket.io'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import * as compilerName from '../../utils/compilerName'
import detectFeaturesUsed from '../../utils/detectFeaturesUsed'
import getModuleAssetsOnly from '../../utils/getModuleAssetsOnly'
import getSystemPaths from '../../utils/getSystemPaths'
import prepareUrls from '../../utils/prepareUrls'
import print, { info, log, pretty } from '../../utils/print'
import * as processHelpers from '../../utils/process'
import requireInternalConfig from '../../utils/requireInternalConfig'
import createBuildConfig from '../../utils/webpack/createBuildConfig'
import createDevServerConfig from '../../utils/webpack/createDevServerConfig'

interface DevWorkspacesOptions
  extends Arguments<{ port?: number; workspaces: string[]; open?: boolean }> {}

async function devWorkspaces(options: DevWorkspacesOptions): Promise<boolean> {
  const { port, open, workspaces: _workspaces } = Object.assign(
    { port: 4000, open: true },
    options,
  )

  const dev = true
  const cache = true
  const directory = paths.cwd

  // Get the information needed to start workspaces mode
  const internalConfig = requireInternalConfig({
    directory,
    dev,
    required: false,
  })
  const featuresUsed = detectFeaturesUsed(directory, dev)

  const workspaces = _workspaces ?? internalConfig.workspaces
  if (!Array.isArray(workspaces)) {
    throw new Error('Provide `workspaces` field to starts workspaces mode.')
  }

  // Get the require fields to create compiler
  const useYarn = checkIsYarnInstalled()
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const host = 'localhost'
  const urls = await prepareUrls({
    protocol,
    host,
    port,
  })

  const publicUrlOrPath = internalUrlsCreators.modules(urls.port).href
  const resolveOutputDirectory = paths.resolveBuildDirectory(
    directory,
    'workspaces',
  )

  clearConsole()
  info('Cleaning up the directories before proceeding...')
  log()

  // Empty output directory
  await fs.emptyDir(resolveOutputDirectory)

  // Check and get modules paths in workspace
  const resolvesWorkspaces = workspaces.reduce<string[]>(
    (acc, item) => acc.concat(glob.sync(item, { absolute: true })),
    [],
  )
  const internalModulesData = resolvesWorkspaces.reduce(
    (acc, internalModulePath: string) => {
      // Get the information needed of internal module
      const resolveInternalModule = fs.realpathSync(internalModulePath)
      const internalModuleConfig = requireInternalConfig({
        dev,
        directory: resolveInternalModule,
        required: true,
      })
      const internalModulesFeaturesUsed = detectFeaturesUsed(
        resolveInternalModule,
        dev,
      )

      const { name: moduleName } = internalModuleConfig

      // Define output directory and file
      // match with structure define to serve
      const internalModuleCurrentOutputs = getSystemPaths(
        resolveInternalModule,
        internalModuleConfig.output,
      )
      const internalModuleOutputDirectory = path.join(
        resolveOutputDirectory,
        moduleName,
      )
      const internalModuleOutputFile = path.join(
        internalModuleOutputDirectory,
        internalModuleCurrentOutputs.filename,
      )
      const internalModulePublicPath = publicUrlOrPath + moduleName + '/'

      //
      const webpackConfig = createBuildConfig(
        {
          dev,
          cache,
          directory: resolveInternalModule,
          internalConfig: Object.assign({}, internalModuleConfig, {
            publicPath: internalModulePublicPath,
            publicUrlOrPath: paths.resolvePublicUrlOrPath(
              false,
              internalModulePublicPath,
            ),
            output: internalModuleOutputFile,
          }),
        },
        internalModulesFeaturesUsed,
      )

      info(
        `Identified features used for ${print.name(moduleName)}`,
        pretty(internalModulesFeaturesUsed),
      )

      return Object.assign(acc, {
        [moduleName]: {
          webpackConfig,
          directory: resolveInternalModule,
          internalConfig: internalModuleConfig,
          featuresUsed: internalModulesFeaturesUsed,
        },
      })
    },
    {} as { [name: string]: any },
  )

  const internalModulesKeys = Object.keys(internalModulesData)
  const internalModulesConfiguration = internalModulesKeys.map(
    (key: string) => internalModulesData[key].webpackConfig,
  )

  info(
    `Found ${print.bold(
      internalModulesKeys.length,
    )} module(s) in workspaces...`,
  )
  info('Linking module(s)', pretty(internalModulesKeys))
  log()

  const compiler = createCompiler({
    appName: internalConfig.name ?? '??',
    // @ts-expect-error
    config: internalModulesConfiguration,
    urls,
    useYarn,
    webpack,
    useTypeScript: featuresUsed.typescript,
    tscCompileOnError: false,
  })

  //
  compiler.hooks.done.tap('done', async (stats: webpack.Stats) => {
    const { children } = stats.toJson()

    //
    const updatedModules = (children ?? []).reduce((acc, item) => {
      const internalModuleName = item.name?.replace(
        /^(@nuz\/cli\(([\S\s]+)\))/,
        '$2',
      ) as string
      const internalModuleId = moduleIdHelpers.use(internalModuleName)

      const internalModuleData = internalModulesData[internalModuleName]
      if (!internalModuleData) {
        throw new Error(
          `Not found internal module data by ${JSON.stringify(
            internalModuleName,
          )}.`,
        )
      }

      const modulesAssetsOnly = getModuleAssetsOnly(item, { md5sum: false })

      const {
        internalConfig: internalModuleConfig,
        webpackConfig: internalModuleWebpackConfig,
      } = internalModuleData

      return Object.assign(acc, {
        [internalModuleId]: {
          shared: internalModuleConfig.shared,
          library: internalModuleWebpackConfig.output.library,
          format: internalModuleWebpackConfig.output.libraryTarget,
          upstream: {
            main: modulesAssetsOnly.resolve.main.url,
            styles: modulesAssetsOnly.resolve.styles.map((style) => style.url),
          },
        },
      })
    }, {})

    //
    Object.assign(linkingModules, updatedModules)

    //
    triggerModulesReload(
      (children ?? []).map((item) =>
        moduleIdHelpers.use(compilerName.extract((item as any).name)),
      ),
    )
  })

  let isInitialized = false

  const devServer = new WebpackDevServer(
    compiler,
    Object.assign(
      createDevServerConfig({
        publicUrlOrPath,
        standalone: false,
        ignored: [ignoredFiles(directory)],
        contentBase: [resolveOutputDirectory],
      }) as any,
      {
        contentBasePublicPath: ['/'],
      },
    ),
  )

  const httpServer = devServer.listen(urls.port, urls.host, (err) => {
    if (err) {
      return console.log(err)
    }

    if (isInitialized) {
      clearConsole()
    }

    if (open) {
      openBrowser(urls.localUrlForBrowser)
    }

    isInitialized = true
  })

  const linkingModules = {}

  // Create socket to watching changes and reload
  const socket = io(httpServer, {
    path: internalUrlsCreators.watch(urls.port).pathname,
    serveClient: false,
    cookie: false,
  })
  // Fired a callback on connection event
  socket.on('connection', function connection(client) {
    client.emit(LINKED_DEFINE_EVENT, {
      modules: linkingModules,
    })
  })

  // Create socket helpers
  function triggerModulesReload(changes: string[]) {
    socket.emit(LINKED_CHANGE_EVENT, { changes })
  }

  //
  processHelpers.onExit(() => {
    socket.close()
    devServer.close()
    process.exit()
  })

  return false
}

export default devWorkspaces
