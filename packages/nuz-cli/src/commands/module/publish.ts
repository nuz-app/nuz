import { ModuleFormats } from '@nuz/shared'
import { wait } from '@nuz/utils'
import path from 'path'
import { Arguments } from 'yargs'

import { STATS_FILENAME } from '../../lib/const'

import Worker from '../../classes/Worker'

import checkIsUrl from '../../utils/checkIsUrl'
import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import pickFilesFromStats from '../../utils/pickFilesFromStats'
import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

import optimized from '../build/optimized'

function checkIsHaveSlash(url: string) {
  try {
    const lastChar = url[url.length - 1]
    return lastChar === '/'
  } catch {
    return false
  }
}

async function publish({
  fallback,
  selfHosted = false,
}: Arguments<{ fallback: string; selfHosted: boolean }>) {
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

  const { name, library, version, output, publicPath } = moduleConfig

  if (selfHosted) {
    // const publicPathIsUrl = checkIsUrl(publicPath)
    // if (!publicPathIsUrl) {
    //   throw new Error('The public path needs to be a valid url')
    // }

    const publicPathIsHaveSlash = checkIsHaveSlash(publicPath)
    if (!publicPathIsHaveSlash) {
      throw new Error('The public path needs have slash at end')
    }

    await optimized({ publicPath } as any)
  } else {
    await optimized({ publicPath: '/' } as any)
  }

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

  const useIntegrity = false
  const stats = await fs.readJson(statsPath)
  const assets = pickAssetsFromStats(stats, { useIntegrity })
  const files = pickFilesFromStats(stats)

  const data = {
    version,
    library,
    resolve: assets.resolve,
    files: assets.files,
    format: ModuleFormats.umd,
  }
  const options = { fallback, selfHosted }

  const tick = timer()
  const request = await Worker.publishModule(name, data, files, options)
  const moduleId = request?.data?._id

  info('Published was successfully!')
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default publish