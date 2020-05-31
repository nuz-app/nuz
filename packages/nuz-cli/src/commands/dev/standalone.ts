import path from 'path'
import { Arguments } from 'yargs'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackDevServer from 'webpack-dev-server'
import * as paths from '../../paths'
import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getFeatureConfig from '../../utils/getFeatureConfig'
import { error, info, pretty } from '../../utils/print'
import webpackConfigFactory from '../../utils/webpack/factories/buildConfig'
import devServerConfigFactory from '../../utils/webpack/factories/devServerConfig'
import InterpolateHtmlPlugin from '../../utils/webpack/InterpolateHtmlPlugin'
import * as webpackCompiler from '../../utils/webpackCompiler'

async function standalone({
  port = 4000,
  open = 'Google Chrome',
}: Arguments<{ port?: number; open?: string }>) {
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

  exitIfModuleInsufficient(moduleConfig)

  const { name, output } = moduleConfig

  const featureConfig = getFeatureConfig(dir, moduleConfig)
  const distDir = path.join(dir, path.dirname(output))

  clearConsole()
  info('Clean up distributable module folder')
  await fs.emptyDir(distDir)

  info('Features config using', pretty(featureConfig))
  const buildConfig = webpackConfigFactory(
    {
      dev: true,
      cache: true,
      dir,
      module: name,
      config: moduleConfig,
    },
    featureConfig,
    { showProcess: true, injectReact: true },
  )
  buildConfig.entry = path.join(
    dir,
    featureConfig.typescript ? 'public/index.ts' : 'public/index.js',
  )

  // @ts-ignore
  buildConfig.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      title: name,
      template: path.join(paths.app, './public/index.html'),
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL:
        buildConfig.output.publicPath !== '/'
          ? buildConfig.output.publicPath
          : '',
    }),
  )

  const devServerConfig = devServerConfigFactory({ dir, open })
  const compiler = webpackCompiler.get(
    buildConfig as webpackCompiler.AllowWebpackConfig,
  )
  const devServer = new WebpackDevServer(compiler, devServerConfig)

  devServer.listen(port, (err) => {
    if (err) {
      return error(err)
    }

    info(`Server was created to files serving for the module`)
    info(
      'Module information',
      pretty({
        name,
        port,
      }),
    )
  })

  return false
}

export default standalone
