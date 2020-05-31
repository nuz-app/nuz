import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import clearConsole from 'react-dev-utils/clearConsole'
import * as webpack from 'webpack'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkRequiredModuleConfig from '../../utils/checkRequiredModuleConfig'
import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import getBundleInfo from '../../utils/getBundleInfo'
import getFeatureConfig from '../../utils/getFeatureConfig'
import print, { info, pretty, success } from '../../utils/print'
import showErrorsAndWarnings from '../../utils/showErrorsAndWarnings'
import webpackConfigFactory from '../../utils/webpack/factories/buildConfig'
import * as webpackCompiler from '../../utils/webpackCompiler'

async function optimized({ publicPath }: Arguments<{ publicPath?: string }>) {
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
  if (publicPath) {
    moduleConfig.publicPath = publicPath
  }

  const { name, output } = moduleConfig

  const featureConfig = getFeatureConfig(dir, moduleConfig)
  const distDir = path.join(dir, path.dirname(output))

  clearConsole()
  info('Clean up distributable module folder')
  await fs.emptyDir(distDir)

  info('Features config using', pretty(featureConfig))
  const buildConfig = webpackConfigFactory(
    {
      dev: false,
      cache: true,
      dir,
      module: name,
      config: moduleConfig,
    },
    featureConfig,
  )

  const compiler = webpackCompiler.run(buildConfig as webpack.Configuration)
  info('Compiler was created for this module')
  const bundle = await compiler

  const bundleInfo = getBundleInfo(bundle)
  if (!bundleInfo.done) {
    showErrorsAndWarnings(bundleInfo)
    throw new Error('Have errors thrown while bundle module, please check it!')
  }

  const outputFile = path.join(dir, output)
  const integrity = integrityHelpers.file(outputFile)

  success(`${print.name(name)} module was built successfully!`)
  info(`Output file integrity is ${print.blueBright(integrity)}`)

  return true
}

export default optimized
