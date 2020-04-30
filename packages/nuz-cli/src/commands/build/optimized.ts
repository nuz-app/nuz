import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import * as webpack from 'webpack'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import getBundleInfo from '../../utils/getBundleInfo'
import getFeatureConfig from '../../utils/getFeatureConfig'
import * as paths from '../../utils/paths'
import print, {
  error,
  info,
  log,
  pretty,
  success,
  warn,
} from '../../utils/print'
import * as webpackCompiler from '../../utils/webpackCompiler'
import webpackConfigFactory from '../../utils/webpackConfigFactory'

function showErrorsAndWarnings({
  errors,
  warnings,
}: {
  errors: string[]
  warnings: string[]
}) {
  if (errors.length > 0) {
    error('Have some errors from stats of bundle')
    errors.forEach((item) => log(item))
  }

  if (warnings.length > 0) {
    warn('Have some warnings from stats of bundle')
    warnings.forEach((item) => log(item))
  }
}

async function optimized() {
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

  const { name, output, serve: serveConfig } = moduleConfig

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
