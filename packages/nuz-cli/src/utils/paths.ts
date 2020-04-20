import findCacheDir from 'find-cache-dir'
import fs from 'fs'
import path from 'path'

import getPackageJsonTool from './getPackageJsonTool'

export const tool = fs.realpathSync(path.join(__dirname, '../../'))

export const cwd = fs.realpathSync(process.cwd())
export const app = cwd

export const configInDir = (dir: string, ...rest: string[]) =>
  path.join(dir, '.nuz', ...rest)
export const newAppInDir = (dir: string, name: string) => [dir, name].join('/')
export const configFileInDir = (dir: string, ext: string = '*') =>
  [dir, `nuz.config.${ext}`].join('/')
export const packageJsonInDir = (dir: string) => [dir, `package.json`].join('/')

export const cacheInApp = findCacheDir({
  name: getPackageJsonTool().name,
  thunk: true,
})
export const resolveInApp = (name: string, dir?: string) =>
  require.resolve(name, {
    paths: [
      dir && dir !== app && path.join(dir, 'node_modules'),
      path.join(app, 'node_modules'),
      path.join(tool, 'node_modules'),
    ].filter(Boolean) as string[],
  })
