import { ModuleFormats } from '@nuz/shared'
import { assetsUrlHelpers, pick } from '@nuz/utils'
import glob from 'glob'
import path from 'path'
import { Arguments } from 'yargs'

import { STATS_FILENAME } from '../../lib/const'

import Config, { ConfigKeys } from '../../classes/Config'
import Worker from '../../classes/Worker'

import * as paths from '../../paths'
import * as configHelpers from '../../utils/configHelpers'
import createQuestions from '../../utils/createQuestions'
import * as fs from '../../utils/fs'
import pickAssetsFromStats from '../../utils/pickAssetsFromStats'
import pickFilesFromStats from '../../utils/pickFilesFromStats'
import print, { info, success } from '../../utils/print'
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

async function getDetailsOfModule(dir: string) {
  const pkgJson = await fs.readJson(paths.resolvePackageJson(dir))
  const details = pick(pkgJson, [
    'description',
    'homepage',
    'bugs',
    'repository',
    'license',
    'keywords',
  ]) as any

  const match = glob.sync(path.join(dir, '/readme.md'))
  if (match[0]) {
    details.readme = fs.read(match[0]).toString('utf8')
  }

  return details
}

async function publish({
  fallback,
  selfHosted = false,
  yes = false,
}: Arguments<{ fallback: string; selfHosted: boolean; yes: boolean }>) {
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

  const { name, library, version, output, publicPath } = moduleConfig

  const staticOrigin = (await Config.readConfig())[ConfigKeys.static]
  const publicPathUsed = selfHosted
    ? publicPath
    : assetsUrlHelpers.createOrigin(name, version, staticOrigin)
  const publicPathIsHaveSlash = checkIsHaveSlash(publicPathUsed)
  if (!publicPathIsHaveSlash) {
    throw new Error('The public path needs have slash at end')
  }

  const result = yes
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
  if (!result.isConfirmed) {
    return true
  }

  await optimized({ publicPath: publicPathUsed } as any)

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

  const [details, stats]: any[] = await Promise.all([
    getDetailsOfModule(dir),
    fs.readJson(statsPath),
  ])
  const assets = pickAssetsFromStats(stats, { md5sum: true })
  const files = pickFilesFromStats(stats)

  const data = {
    version,
    library,
    details,
    resolve: assets.resolve,
    files: assets.files,
    format: ModuleFormats.umd,
  }
  const options = { fallback, selfHosted, static: staticOrigin }

  const tick = timer()
  const request = await Worker.publishModule(name, data, files, options)
  const moduleId = request?.data?._id

  info(`Published module ${moduleId} was successfully!`)
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default publish
