export enum RunModes {
  development = 'development',
  production = 'production',
}

export enum RuntimePlatforms {
  web = 'web',
  node = 'node',
}

export enum ModuleFormats {
  umd = 'umd',
}

export interface InstallConfig {
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

export type UpstreamResolveResource = ({ path: string } | { url: string }) & {
  integrity: string
}

export type UpstreamResolveConfig = (
  | {
      web?: string | UpstreamResolveResource
      node?: string | UpstreamResolveResource
    }
  | {
      main?: string | UpstreamResolveResource
    }
) & {
  styles?: (string | UpstreamResolveResource)[]
}

export enum UpstreamHosts {
  self = 'self',
  unpkg = 'unpkg',
}

export interface UpstreamFullConfig {
  host: UpstreamHosts
  resolve: string | UpstreamResolveConfig
}

/**
 * Upstream config inside item config
 */
export type UpstreamConfigAllowed =
  | (UpstreamFullConfig &
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
  options?: InstallConfig
  /**
   * Shared dependencies module used
   */
  shared?: string[]
}

export enum EventTypes {
  initial = 'initial',
  ready = 'ready',
}
