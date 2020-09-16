import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import clearConsole from 'react-dev-utils/clearConsole'
import ignoredFiles from 'react-dev-utils/ignoredFiles'
import openBrowser from 'react-dev-utils/openBrowser'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import { createCompiler } from 'react-dev-utils/WebpackDevServerUtils'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import createQuestions from '../../utils/createQuestions'
import detectFeaturesUsed from '../../utils/detectFeaturesUsed'
import getSystemPaths from '../../utils/getSystemPaths'
import prepareUrls from '../../utils/prepareUrls'
import { info, log, pretty } from '../../utils/print'
import * as processHelpers from '../../utils/process'
import requireInternalConfig from '../../utils/requireInternalConfig'
import createWebpackConfig from '../../utils/webpack/factories/buildConfig'
import createDevServerConfig from '../../utils/webpack/factories/devServerConfig'

interface DevStandaloneOptions
  extends Arguments<{ port?: number; open?: string | boolean }> {}

async function standalone(options: DevStandaloneOptions): Promise<boolean> {
  const { port, open } = Object.assign({ port: 4000, open: true }, options)

  const dev = true
  const cache = true
  const directory = paths.cwd

  // Get the information needed to start development mode
  const internalConfig = requireInternalConfig(directory, true)
  const publicUrlOrPath = paths.publicUrlOrPath(
    directory,
    internalConfig.publicPath,
  )
  const featuresUsed = detectFeaturesUsed(directory)
  const outputPaths = getSystemPaths(directory, internalConfig.output)
  const publicDirectory = paths.resolvePublicDirectory(directory)

  // Get and ensure public script and html index files
  const publicScriptIndexPath = path.join(
    publicDirectory,
    featuresUsed.typescript ? 'index.ts' : 'index.js',
  )
  const publicHtmlIndexPath = path.join(publicDirectory, 'index.html')

  //
  function canUsePublicDirectory(): boolean {
    return checkRequiredFiles([publicScriptIndexPath, publicHtmlIndexPath])
  }

  if (!canUsePublicDirectory()) {
    const answers = await createQuestions<{ isConfirmed: boolean }>([
      {
        type: 'confirm',
        name: 'isConfirmed',
        default: true,
        message: `Not found public directory. Do you want to initial it?`,
      },
    ])
    if (answers.isConfirmed) {
      const moduleTemplateDirectory = paths.resolveModuleTemplate('public')

      //
      await fs.copy(paths.resolveModuleTemplate('public'), publicDirectory, {
        recursive: true,
        dereference: true,
      })
      await fs.remove(
        path.join(
          moduleTemplateDirectory,
          !featuresUsed.typescript ? 'index.ts' : 'index.js',
        ),
      )
    }

    if (!canUsePublicDirectory()) {
      throw new Error(
        'Some required files were not found in the public directory.',
      )
    }
  }

  clearConsole()
  info('Cleaning up the directories before proceeding...')
  log()

  // Empty output directory
  await fs.emptyDir(outputPaths.directory)

  info('Identified features used', pretty(featuresUsed))
  log()

  //
  const webpackConfig = createWebpackConfig(
    {
      dev,
      cache,
      dir: directory,
      module: internalConfig.name,
      config: Object.assign({}, internalConfig, {
        input: publicScriptIndexPath,
      }),
    },
    featuresUsed,
    { showProcess: false, injectReact: true },
  )

  webpackConfig.plugins?.push(
    // @ts-ignore
    new HtmlWebpackPlugin({
      template: publicHtmlIndexPath,
      // Inject all main scripts to template
      inject: true,
      // Errors details will be written into the HTML page
      showErrors: true,
      // Modern browsers support non blocking javascript loading ('defer') to
      // improve the page startup performance.
      scriptLoading: 'blocking',
      // The file to write the HTML to
      filename: 'index.html',
      // Allows to control how chunks should be sorted before
      // they are included to the HTML
      chunksSortMode: 'auto',
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      // Remove slash at end from `publicPath`
      // Example publicPath: `https://nuz.app/` -> `https://nuz.app`
      PUBLIC_URL: publicUrlOrPath?.slice(0, -1) as string,
    }),
  )

  // Get the require fields to create compiler
  const useYarn = checkIsYarnInstalled()
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const host = 'localhost'
  const urls = await prepareUrls({ protocol, host, port })

  // @ts-ignore
  const compiler = createCompiler({
    appName: internalConfig.name,
    config: webpackConfig,
    urls,
    useYarn,
    webpack,
    useTypeScript: featuresUsed.typescript,
    tscCompileOnError: false,
  })

  let isInitialized = false

  //
  const devServer = new WebpackDevServer(
    compiler,
    createDevServerConfig({
      standalone: true,
      publicUrlOrPath,
      ignored: [ignoredFiles(directory)],
      contentBase: [publicDirectory],
    }) as any,
  )
  devServer.listen(urls.port, urls.host, (err) => {
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

  //
  processHelpers.onExit(() => {
    devServer.close()
    process.exit()
  })

  return false
}

export default standalone
