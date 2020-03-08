import glob from 'glob'

import { ModuleConfig } from '../types/common'

import * as fs from '../utils/fs'
import * as paths from '../utils/paths'
import getPackageJsonInDir from './getPackageJsonInDir'

export const get = (dir: string): string => {
  const matches = glob.sync(paths.config(dir))
  const configPath = matches[0]
  return configPath
}

export const exists = (dir: string): boolean => !!get(dir)

export const ensure = (dir: string) => {
  const file = paths.config(dir)
  const existed = fs.exists(file)
  if (!existed) {
    //
  }
}

export const extract = (dir: string): ModuleConfig | null => {
  try {
    const { name, version, library, source, main } = getPackageJsonInDir(dir)
    const config = require(require.resolve(get(dir)))

    return Object.assign(
      {},
      { name, version, library, input: source, output: main },
      config,
    )
  } catch (error) {
    return null
  }
}
