import { BaseItemConfig } from './common'

export interface InstallConfig {
  timeout?: number
  retries?: number
}

export type ModuleItemConfig = BaseItemConfig
export type ModulesConfig = BaseItemConfig[]

export type ExternalItemConfig = BaseItemConfig
export type ExternalsConfig = BaseItemConfig[]

export interface BootstrapConfig {
  /**
   * Defined modules to resolve in runtime
   */
  modules?: ModulesConfig
  /**
   * Defined externals to resolve in runtime
   */
  externals?: ExternalsConfig
  /**
   * Allow preload modules in runtime, only support in browser
   */
  preload?: string[]
}

export interface UpstreamConfig {
  url: string
  integrity?: string
  timeout?: number
  retries?: number
}
