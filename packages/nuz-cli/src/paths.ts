import findCacheDir from 'find-cache-dir'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'

import ensureSlash from './utils/ensureSlash'

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
 * Resolve source directory in the project
 */
export function resolveSourceDirectory(directory: string): string {
  return path.resolve(directory, 'src')
}

/**
 * Read package.json file in the tool directory
 */
export function packageJsonTool<T = any>(): T {
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
export function resolveBuildDirectory(
  directory: string,
  ...rest: string[]
): string {
  return path.join(directory, '.nuz', ...rest)
}

/**
 * Resolve internal config file in the directory
 */
export function resolveInternalConfig(
  directory: string,
  defaultIfNull: boolean,
): string | undefined {
  const useTypescript = fs.existsSync(resolveTsConfigFile(directory))
  const resolvePath = path.join(
    directory,
    useTypescript ? 'nuz.config.ts' : 'nuz.config.js',
  )

  if (fs.existsSync(resolvePath)) {
    return resolvePath
  }

  return defaultIfNull ? resolvePath : undefined
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
export function resolveTemplates(...rest: string[]): string {
  return path.join(tool, 'templates', ...rest)
}

/**
 * Resolve relative path in the tool examples directory
 */
export function resolveExamples(...rest: string[]): string {
  return path.join(tool, 'examples', ...rest)
}

/**
 * Resolve relative path in the module template directory
 */
export function resolveModuleTemplate(...rest: string[]): string {
  return resolveTemplates('module', ...rest)
}

/**
 * Resolve relative path in the root template directory
 */
export function resolveRootTemplate(...rest: string[]): string {
  return resolveTemplates('root', ...rest)
}

/**
 * Resolve `node_modules` directory in the directory
 */
export function resolveNodeModulesDirectory(directory: string): string {
  return path.resolve(directory, 'node_modules')
}

/**
 * Resolve tsconfig.json file in the directory
 */
export function resolveTsConfigFile(directory: string): string {
  return path.resolve(directory, 'tsconfig.json')
}

/**
 * Resolve `nuz-env.d.ts` file in the directory
 */
export function resolveGlobalTypesFile(directory: string): string {
  return path.resolve(directory, 'nuz-env.d.ts')
}

/**
 * Resolve README.md file in the directory
 */
export function resolveReadmeFile(directory: string): string {
  return path.resolve(directory, 'README.md')
}

/**
 * Resolve in the project public directory
 */
export function resolvePublicDirectory(
  directory: string,
  ...rest: string[]
): string {
  return path.join(directory, 'public', ...rest)
}

/**
 * Resolve in the root directory
 */
export function resolveRootDirectory(...rest: string[]): string {
  return path.join(os.homedir(), '.nuz', ...rest)
}

/**
 * Get public url or path based on environment
 * in the directory
 */
export function resolvePublicUrlOrPath(
  dev: boolean,
  publicUrl: string,
): string {
  if (!dev) {
    return ensureSlash(publicUrl)
  }

  // Only for development mode
  const url = new URL(publicUrl, 'https://nuz.app')
  return ensureSlash(url.pathname)
}
