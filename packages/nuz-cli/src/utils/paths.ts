import findCacheDir from 'find-cache-dir'
import fs from 'fs'
import path from 'path'

import getPackageJsonTool from './getPackageJsonTool'

export const tool = fs.realpathSync(path.join(__dirname, '../../'))

export const cwd = fs.realpathSync(process.cwd())

export const nuz = (dir: string, ...rest: string[]) =>
  path.join(dir, '.nuz', ...rest)

export const app = (name: string) => [cwd, name].join('/')

export const config = (root: string, ext: string = '*') =>
  [root, `nuz.config.${ext}`].join('/')

export const packageJson = (root: string) => [root, `package.json`].join('/')

export const cache = findCacheDir({
  name: getPackageJsonTool().name,
  thunk: true,
})
