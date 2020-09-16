import { integrityHelpers } from '@nuz/utils'
import fs from 'fs-extra'
import path from 'path'
import clearConsole from 'react-dev-utils/clearConsole'
import * as webpack from 'webpack'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import builder from '../../utils/builder'
import detectFeaturesUsed from '../../utils/detectFeaturesUsed'
import getBuildOutputInformation from '../../utils/getBuildOutputInformation'
import getOutputDirectory from '../../utils/getOutputDirectory'
import print, { info, log, pretty, success } from '../../utils/print'
import printBuildOutputMessages from '../../utils/printBuildOutputMessages'
import requireInternalConfig from '../../utils/requireInternalConfig'
import webpackConfigFactory from '../../utils/webpack/factories/buildConfig'

interface BuildOptimizedOptions extends Arguments<{ publicPath?: string }> {}

async function optimized(options: BuildOptimizedOptions): Promise<boolean> {
  const { publicPath } = options

  const directory = paths.cwd
  const dev = false
  const cache = true
  const internalConfig = requireInternalConfig(directory, true)

  // Override `publicPath` field in internal config
  if (typeof publicPath === 'string') {
    internalConfig.publicPath = publicPath
  }

  // Detect features used and get output directory
  const featuresUsed = detectFeaturesUsed(directory)
  const outputDirectory = getOutputDirectory(directory, internalConfig.output)

  clearConsole()
  info('Cleaning up the directories before proceeding...')
  log()

  // Empty output directory
  fs.emptyDirSync(outputDirectory)

  info('Identified features used', pretty(featuresUsed))
  log()

  //
  const buildConfig = webpackConfigFactory(
    {
      dev,
      cache,
      dir: directory,
      module: name,
      config: internalConfig,
    },
    featuresUsed,
  )

  const compile = builder(buildConfig as webpack.Configuration)
  info('Compiler was created for this module.')
  log()

  //
  const buildOutput = await compile
  const buildInfo = getBuildOutputInformation(buildOutput.stats)
  if (!buildInfo.done) {
    printBuildOutputMessages(buildInfo)
    throw new Error('There was a build error, please see details above.')
  }

  const integrity = integrityHelpers.file(
    path.join(directory, internalConfig.output),
  )

  //
  success(`Module ${print.name(name)} was built successfully!`)
  info(`Output file integrity is ${print.blueBright(integrity)}.`)

  return true
}

export default optimized
