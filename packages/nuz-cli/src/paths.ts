import { checkIsProductionMode } from '@nuz/utils'
import findCacheDir from 'find-cache-dir'
import fs from 'fs'
import path from 'path'
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath'

export const tool = fs.realpathSync(path.join(__dirname, '..'))
export const cwd = fs.realpathSync(process.cwd())

export const app = cwd

export function packageJsonTool() {
  return require(resolvePackageJson(tool))
}

export function bundlesDirectory(dir: string, ...rest: string[]) {
  return path.join(dir, '.nuz', ...rest)
}

export function newModuleDirectory(dir: string, name: string) {
  return `${dir}/${name}`
}

export function resolveConfigFile(dir: string, ext: string = '*') {
  return `${dir}/nuz.config.${ext}`
}

export function resolvePackageJson(dir: string) {
  return `${dir}/package.json`
}

export const resolveModuleCache = findCacheDir({
  name: packageJsonTool().name,
  thunk: true,
})

export function resolveModule(name: string, dir?: string) {
  return require.resolve(name, {
    paths: [
      dir && dir !== app && path.join(dir, 'node_modules'),
      path.join(app, 'node_modules'),
      path.join(tool, 'node_modules'),
      'node_modules',
    ].filter(Boolean) as string[],
  })
}

export function resolveFromTemplate(file: string) {
  return path.join(tool, './templates', file)
}

export function publicUrlOrPath(dir: string, publicUrl: string) {
  return getPublicUrlOrPath(
    !checkIsProductionMode(),
    require(resolvePackageJson(dir)).homepage,
    publicUrl,
  )
}
