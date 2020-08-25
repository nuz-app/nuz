import { ModuleFormats } from '@nuz/shared'

export enum RunModes {
  development = 'development',
  production = 'production',
}

export enum RuntimePlatforms {
  web = 'web',
  node = 'node',
}

export interface LoadModuleConfiguration {
  [key: string]: any
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
      Pick<
        BaseModuleConfiguration,
        'library' | 'format' | 'alias' | 'exportsOnly'
      >)
  | string

export type BaseModuleConfiguration = {
  /**
   * Module id
   */
  id?: string
  /**
   * Module name
   */
  name?: string
  /**
   * Specify the version you want to use
   */
  version?: string
  /**
   * Module information is used at this time
   */
  upstream?: UpstreamConfigAllowed
  /**
   * Module information is used if an error occurs
   */
  fallback?: UpstreamConfigAllowed
  /**
   * Override module by a Node.js require
   */
  local?: LoadedModule<any>
  /**
   * The name of the module if it is an UMD library
   */
  library?: string
  /**
   * The module format, currently only supports UMD.
   */
  format?: ModuleFormats
  /**
   * Alias some properties of the module are exports
   */
  alias?: { [field: string]: any }
  /**
   * Only give properties allowed, remove the rest.
   */
  exportsOnly?: string[]
  /**
   * Configure when downloading for the module
   */
  options?: LoadModuleConfiguration
  /**
   * Declare shared dependencies
   */
  shared?: string[]
}

export type RequiredModuleConfiguration = BaseModuleConfiguration &
  Required<
    Pick<
      BaseModuleConfiguration,
      'id' | 'version' | 'name' | 'local' | 'alias' | 'exportsOnly' | 'upstream'
    >
  >
