import { getPackageJsonInDir } from '@nuz/utils'
import glob from 'glob'

import { ModuleConfig } from '../types/common'

import * as fs from '../utils/fs'
import * as paths from '../utils/paths'

export const get = (dir: string): string => {
  const matches = glob.sync(paths.configFileInDir(dir))
  const configPath = matches[0]
  return configPath
}

export const exists = (dir: string): boolean => !!get(dir)

export const ensure = (dir: string) => {
  const file = paths.configFileInDir(dir)
  const existed = fs.exists(file)
  if (!existed) {
    //
  }
}

const REQUIRED_FIELDS = ['name', 'version', 'library', 'input', 'output']

export const extract = (
  dir: string,
  required: boolean = true,
): ModuleConfig | null => {
  try {
    const { name, version, library, source, main } = getPackageJsonInDir(dir)

    const config = require(require.resolve(get(dir)))
    const full = Object.assign(
      {},
      { name, version, library, input: source, output: main },
      config,
    )

    const isInvalid = !REQUIRED_FIELDS.every((field) => !!full[field])
    if (required && isInvalid) {
      return null
    }

    return full
  } catch (error) {
    return null
  }
}
