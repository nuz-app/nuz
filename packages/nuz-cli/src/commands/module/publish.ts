import { ModuleFormats } from '@nuz/shared'
import { assetsUrlHelpers } from '@nuz/utils'
import fs from 'fs-extra'
import path from 'path'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import { STATS_FILENAME } from '../../lib/const'
import * as paths from '../../paths'
import { ConfigurationFields } from '../../types'
import checkIsHaveSlash from '../../utils/checkIsHaveSlash'
import createQuestions from '../../utils/createQuestions'
import getFilesBufferOnly from '../../utils/getFilesBufferOnly'
import getModuleAssetsOnly from '../../utils/getModuleAssetsOnly'
import getOutputDirectory from '../../utils/getOutputDirectory'
import print, { info, log } from '../../utils/print'
import requireInternalConfig from '../../utils/requireInternalConfig'
import snapshotReport from '../../utils/snapshotReport'
import optimized from '../build/optimized'

interface ModulePublishOptions
  extends Arguments<{ fallback: string; selfHosted: boolean; yes: boolean }> {}

async function publish(options: ModulePublishOptions): Promise<boolean> {
  const { fallback, selfHosted, yes } = Object.assign(
    { selfHosted: false, yes: false },
    options,
  )

  const directory = paths.cwd
  const internalConfig = requireInternalConfig(directory, true)
  const outputDirectory = getOutputDirectory(directory, internalConfig.output)

  const { name, library, version } = internalConfig

  const staticOrigin = (await Config.readConfiguration())[
    ConfigurationFields.static
  ]
  const publicPath = selfHosted
    ? internalConfig.publicPath
    : assetsUrlHelpers.createOrigin(name, version, staticOrigin)

  if (!checkIsHaveSlash(publicPath)) {
    throw new Error('The public path needs have slash at end.')
  }

  // Confirm version before publish new module
  const answers = yes
    ? { isConfirmed: true }
    : await createQuestions<{ isConfirmed: boolean }>([
        {
          type: 'confirm',
          name: 'isConfirmed',
          default: true,
          message: `Are you sure want to publish version ${print.bold(
            version,
          )} ?`,
        },
      ])
  if (!answers.isConfirmed) {
    return true
  }

  // Build with optimized before publish to registry
  await optimized({ publicPath } as any)

  // Resolve output stats file
  const resolvedStatsFile = path.join(outputDirectory, STATS_FILENAME)
  if (!fs.existsSync(resolvedStatsFile)) {
    throw new Error(
      `Not found ${JSON.stringify(STATS_FILENAME)} file in output directory.`,
    )
  }

  info(
    `Prepare to publish version ${print.blue(version)} for ${print.name(
      name,
    )} module...`,
  )
  log()

  // Get the information needed to publish
  const details = snapshotReport(directory)
  const stats = fs.readJsonSync(resolvedStatsFile)
  const assets = getModuleAssetsOnly(stats, { md5sum: true })
  const filesBuffer = getFilesBufferOnly(stats)

  // Request to publish the new version
  const request = await Worker.publishModule(
    name,
    {
      version,
      library,
      details,
      resolve: assets.resolve,
      files: assets.files,
      format: ModuleFormats.umd,
    },
    filesBuffer,
    {
      fallback,
      selfHosted,
      static: staticOrigin,
    },
  )
  const moduleId = request?.data?._id

  info(`Published module ${moduleId} was successfully!`)
  log()

  return true
}

export default publish
