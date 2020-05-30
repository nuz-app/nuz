import findCacheDir from 'find-cache-dir'
import fs from 'fs'
import path from 'path'

export const tool = fs.realpathSync(path.join(__dirname, '..'))
export const cwd = fs.realpathSync(process.cwd())

export const app = cwd

export function getPackageJsonTool() {
  return require(packageJsonInDir(tool))
}

export function configInDir(dir: string, ...rest: string[]) {
  return path.join(dir, '.nuz', ...rest)
}

export function newAppInDir(dir: string, name: string) {
  return `${dir}/${name}`
}

export function configFileInDir(dir: string, ext: string = '*') {
  return `${dir}/nuz.config.${ext}`
}

export function packageJsonInDir(dir: string) {
  return `${dir}/package.json`
}

export const cacheInApp = findCacheDir({
  name: getPackageJsonTool().name,
  thunk: true,
})

export function resolveInApp(name: string, dir?: string) {
  return require.resolve(name, {
    paths: [
      dir && dir !== app && path.join(dir, 'node_modules'),
      path.join(app, 'node_modules'),
      path.join(tool, 'node_modules'),
    ].filter(Boolean) as string[],
  })
}

export function inTemplate(file: string) {
  return path.join(tool, './templates', file)
}
