import { BaseItemConfig } from './common'

export interface InstallConfig {
  timeout?: number
  retries?: number
}

export type ModuleItemConfig = BaseItemConfig
export interface ModulesConfig {
  [name: string]: ModuleItemConfig
}

export interface VendorsConfig {
  [dependency: string]: any
}

export interface RegistryConfig {
  url: string
  timeout?: number
  retries?: number
  integrity?: string
}

export interface BootstrapConfig {
  /**
   * Set development mode
   */
  dev?: boolean
  /**
   * Config registry to resolve
   */
  registry?: string | RegistryConfig
  /**
   * Linked info, use for workspace
   */
  linked?: {
    port: number
  }
  /**
   * Defined modules to resolve in runtime
   */
  modules?: ModulesConfig
  /**
   * Defined vendors dependencies
   */
  vendors?: VendorsConfig
  /**
   * Allow preload modules in runtime, only support in browser
   */
  preload?: string[]
}

export interface LiveConfig {
  url: string
  integrity?: string
  timeout?: number
  retries?: number
}
