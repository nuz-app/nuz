import { wait } from '@nuz/utils'
import path from 'path'
import { Arguments } from 'yargs'

import { STATS_FILENAME } from '../../lib/const'
import { ModuleConfig } from '../../types'

import Worker from '../../classes/Worker'

import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import print, { info, log, pretty, success } from '../../utils/print'

async function publish({ fallback }: Arguments<{ fallback: string }>) {
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

  info('Please ensure module was built before publish')

  const { name, version, output } = moduleConfig

  const distDir = path.join(dir, path.dirname(output))
  const statsPath = path.join(distDir, STATS_FILENAME)
  if (!fs.exists(statsPath)) {
    throw new Error('Not found stats file of bundle')
  }

  info(
    `Prepare to publish version ${print.blue(version)} for ${print.name(
      name,
    )} module...`,
  )

  // Wait to abort if user wants to do it
  await wait(1000)

  const stats = await fs.readJson(statsPath)
  const resolve = pickAssetsFromStats(stats, { useIntegrity: true })
  console.log({ resolve })

  success('Published was successfully!')
  return true
  // const request = await Worker.getCollaboratorsOfModule(id)

  // const moduleId = request?.data?._id
  // const collaborators = request?.data?.collaborators

  // info(`Collaborators of ${print.name(moduleId)} module`)
  // log(pretty(collaborators))
  // return true
}

export default publish
