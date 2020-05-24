import { ModuleFormats } from '@nuz/shared'

export enum RunModes {
  development = 'development',
  production = 'production',
}

export enum RuntimePlatforms {
  web = 'web',
  node = 'node',
}

export interface LoadModuleConfig {
  timeout?: number
  retries?: number
}

export type LoadedModule<T = unknown> = {
  [name: string]: any
  default?: any
  __esModule: boolean
} & T

export type LazyModule<M = unknown> = {
  loaded: boolean
  module: LoadedModule<M>
}

export type UpstreamResolveResource = {
  url: string
  integrity: string
}

export type UpstreamResolveConfig = {
  main: string | UpstreamResolveResource
  styles: (string | UpstreamResolveResource)[]
}

/**
 * Upstream config inside item config
 */
export type UpstreamConfigAllowed =
  | (UpstreamResolveConfig &
      Pick<BaseItemConfig, 'library' | 'format' | 'alias' | 'exportsOnly'>)
  | string

export type BaseItemConfig = {
  /**
   * Module name, it's using to resolve local if module was installed
   */
  name?: string
  /**
   * Upstream is resolve info of module
   */
  upstream?: UpstreamConfigAllowed
  /**
   * Fallback resolve for module, define like `upstream`
   */
  fallback?: UpstreamConfigAllowed
  /**
   * Override local modules
   */
  local?: LoadedModule<any>
  /**
   * Library name, bundle with `umd` format
   */
  library?: string
  /**
   * Format of library. Currently, just support `umd` format
   */
  format?: ModuleFormats
  /**
   * Alias name for fields in module
   */
  alias?: { [field: string]: any }
  /**
   * Export only, not use will exports fields
   */
  exportsOnly?: string[]
  /**
   * Install options
   */
  options?: LoadModuleConfig
  /**
   * Shared dependencies module used
   */
  shared?: string[]
}
