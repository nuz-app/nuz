import { ModuleFormats } from '@nuz/shared'
import { wait } from '@nuz/utils'
import path from 'path'
import { Arguments } from 'yargs'

import { STATS_FILENAME } from '../../lib/const'

import Worker from '../../classes/Worker'

import * as configHelpers from '../../utils/configHelpers'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import print, { info, success } from '../../utils/print'

function checkIsUrl(url: string) {
  try {
    const v = new URL(url)
    return true
  } catch {
    return false
  }
}

function checkIsHaveSlash(url: string) {
  try {
    const lastChar = url[url.length - 1]
    return lastChar === '/'
  } catch {
    return false
  }
}

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

  const { name, library, version, output, publicPath } = moduleConfig

  const distDir = path.join(dir, path.dirname(output))
  const statsPath = path.join(distDir, STATS_FILENAME)
  if (!fs.exists(statsPath)) {
    throw new Error('Not found stats file of bundle')
  }

  const publicPathIsUrl = checkIsUrl(publicPath)
  if (!publicPathIsUrl) {
    throw new Error('The public path needs to be a valid url')
  }

  const publicPathIsHaveSlash = checkIsHaveSlash(publicPath)
  if (!publicPathIsHaveSlash) {
    throw new Error('The public path needs have slash at end')
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

  const data = { version, library, resolve, format: ModuleFormats.umd }
  const options = { fallback }

  const request = await Worker.publishModule(name, data, options)
  const moduleId = request?.data?._id

  success('Published was successfully!')
  return true
}

export default publish
