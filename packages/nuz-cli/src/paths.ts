import { checkIsProductionMode } from '@nuz/utils'
import findCacheDir from 'find-cache-dir'
import fs from 'fs'
import path from 'path'
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath'

/**
 * The path of the tool installed
 */
export const tool = fs.realpathSync(path.join(__dirname, '..'))

/**
 * The current working directory
 */
export const cwd = fs.realpathSync(process.cwd())

/**
 * The target or application directory
 */
export const app = cwd

/**
 * Resolve relative path in the tool directory
 */
export function resolveTool(relative: string): string {
  return path.resolve(tool, relative)
}

/**
 * Resolve relative path in the directory
 */
export function resolveApp(directory: string, relative: string): string {
  return path.resolve(directory, relative)
}

/**
 * Resolve package.json file in the directory
 */
export function resolvePackageJson(directory: string): string {
  return path.resolve(directory, 'package.json')
}

/**
 * Read package.json file in the tool directory
 */
export function packageJsonTool(): any {
  return require(resolvePackageJson(tool))
}

/**
 * Resolve relative path in the cache directory
 */
export const resolveLocalCache = findCacheDir({
  name: packageJsonTool().name,
  thunk: true,
})

/**
 * Resolve in the project build directory
 */
export function resolveBuildDirectory(directory: string, ...rest: string[]) {
  return path.join(directory, '.nuz', ...rest)
}

/**
 * Resolve internal config file in the directory
 */
export function resolveInternalConfig(
  directory: string,
  extension: string = '*',
): string {
  return path.join(directory, `nuz.config.${extension}`)
}

/**
 * Resolve module in the node modules
 * from: extends (?) -> app -> tool -> global.
 */
export function resolveNodeModules(id: string, directory?: string): string {
  const paths = [
    directory && directory !== app && path.join(directory, 'node_modules'),
    path.join(app, 'node_modules'),
    path.join(tool, 'node_modules'),
    'node_modules',
  ].filter(Boolean) as string[]

  return require.resolve(id, {
    paths,
  })
}

/**
 * Resolve relative path in the tool templates directory
 */
export function resolveTemplate(file: string): string {
  return path.join(tool, 'templates', file)
}

/**
 * Get public url or path based on environment
 * in the directory
 */
export function publicUrlOrPath(directory: string, publicUrl: string): string {
  const packageJson = require(resolvePackageJson(directory))

  return getPublicUrlOrPath(
    !checkIsProductionMode(),
    packageJson.homepage,
    publicUrl,
  )
}
