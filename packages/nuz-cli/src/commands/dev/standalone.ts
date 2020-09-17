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
import createBuildConfig from '../../utils/webpack/createBuildConfig'
import createDevServerConfig from '../../utils/webpack/createDevServerConfig'

interface DevStandaloneOptions
  extends Arguments<{ port?: number; open?: string | boolean }> {}

async function standalone(options: DevStandaloneOptions): Promise<boolean> {
  const { port, open } = Object.assign({ port: 4000, open: true }, options)

  const dev = true
  const cache = true
  const directory = paths.cwd

  // Get the information needed to start development mode
  const internalConfig = requireInternalConfig({
    directory,
    dev,
    required: true,
  })
  const featuresUsed = detectFeaturesUsed(directory, dev)
  const outputPaths = getSystemPaths(directory, internalConfig.output)
  const publicDirectory = paths.resolvePublicDirectory(directory)

  // Get and ensure public script and html index files
  const publicScriptIndexPath = path.join(publicDirectory, 'index.js')
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
      //
      await fs.copy(paths.resolveModuleTemplate('public'), publicDirectory, {
        recursive: true,
        dereference: true,
      })

      //
      await fs.remove(
        path.join(
          publicDirectory,
          !featuresUsed.typescript ? 'index.tsx' : 'index.jsx',
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
  const webpackConfig = createBuildConfig(
    {
      dev,
      cache,
      directory,
      internalConfig: Object.assign({}, internalConfig, {
        input: publicScriptIndexPath,
      }),
    },
    featuresUsed,
    { showProcess: false, injectReact: true },
  )

  webpackConfig.plugins?.push(
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          template: paths.resolvePublicDirectory(directory, 'index.html'),
        },
        !dev
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined,
      ),
    ),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // It will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      // Remove slash at end from `publicPath`
      // Example publicPath: `https://nuz.app/` -> `https://nuz.app`
      PUBLIC_URL: internalConfig.publicUrlOrPath.slice(0, -1) as string,
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
      publicUrlOrPath: internalConfig.publicUrlOrPath,
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
