import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import clearConsole from 'react-dev-utils/clearConsole'
import openBrowser from 'react-dev-utils/openBrowser'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import {
  createCompiler,
  prepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import checkRequiredModuleConfig from '../../utils/checkRequiredModuleConfig'
import * as configHelpers from '../../utils/configHelpers'
import ensurePath from '../../utils/ensurePath'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import { info, pretty } from '../../utils/print'
import { onExit } from '../../utils/process'
import webpackConfigFactory from '../../utils/webpack/factories/buildConfig'
import devServerConfigFactory from '../../utils/webpack/factories/devServerConfig'

async function standalone({
  port = 4000,
  open = true,
}: Arguments<{ port?: number; open?: string | boolean }>) {
  const dir = paths.cwd

  const configIsExisted = configHelpers.exists(dir)
  if (!configIsExisted) {
    throw new Error(
      'Not found a config file, file named `nuz.config.js` in root dir',
    )
  }

  const moduleConfig = configHelpers.extract(dir)
  if (!moduleConfig) {
    throw new Error('Config file is invalid')
  }

  checkRequiredModuleConfig(moduleConfig)

  const publicUrlOrPath = paths.publicUrlOrPath(dir, moduleConfig.publicPath)
  const featuresOf = getFeatureConfig(dir, moduleConfig)
  const outputs = ensurePath(dir, moduleConfig.output)
  const publicDirectory = path.join(dir, 'public')
  const publicJsIndexPath = path.join(
    publicDirectory,
    featuresOf.typescript ? 'index.ts' : 'index.js',
  )
  const publicHtmlIndexPath = path.join(publicDirectory, 'index.html')
  if (!checkRequiredFiles([publicJsIndexPath, publicHtmlIndexPath])) {
    throw new Error(
      'Some required files were not found in the `public` directory',
    )
  }

  clearConsole()
  await fs.emptyDir(outputs.directory)
  info('Features config using', pretty(featuresOf))

  const bundleConfig = {
    dev: true,
    cache: true,
    dir,
    module: moduleConfig.name,
    config: Object.assign({}, moduleConfig, { input: publicJsIndexPath }),
  }
  const bundleOptions = { showProcess: false, injectReact: true }
  const webpackConfig = webpackConfigFactory(
    bundleConfig,
    featuresOf,
    bundleOptions,
  )
  if (!webpackConfig.output || !webpackConfig.plugins) {
    throw new Error('An error occurred during config creation')
  }

  webpackConfig.plugins.push(
    // @ts-ignore
    new HtmlWebpackPlugin({
      inject: true,
      template: publicHtmlIndexPath,
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      // Remove slash at end from `publicPath`
      // Example publicPath: `https://nuz.app/` -> `https://nuz.app`
      PUBLIC_URL: publicUrlOrPath?.slice(0, -1) as string,
    }),
  )

  const useYarn = checkIsYarnInstalled()
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const host = 'localhost'

  const urls = prepareUrls(protocol, host, port)
  // @ts-ignore
  const compiler = createCompiler({
    appName: moduleConfig.name,
    config: webpackConfig,
    urls,
    useYarn,
    webpack,
    useTypeScript: featuresOf.typescript,
    tscCompileOnError: false,
  })

  const serverConfig = devServerConfigFactory({
    dir,
    publicUrlOrPath,
    contentBase: [publicDirectory],
  })

  let isInitialized = false
  const devServer = new WebpackDevServer(compiler, serverConfig as any)
  devServer.listen(port, host, (err) => {
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

  onExit(() => {
    devServer.close()
    process.exit()
  })

  return false
}

export default standalone
