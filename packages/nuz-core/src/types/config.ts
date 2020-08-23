import { BaseModuleConfiguration } from './common'

export type ModuleItemConfig = BaseModuleConfiguration
export interface ModulesConfig {
  [name: string]: ModuleItemConfig
}

export interface VendorsConfig {
  [dependency: string]: any
}

export interface LinkedConfig {
  port?: number
}

export interface SharedConfig {
  [name: string]: any
}

export interface BootstrapConfiguration {
  /**
   * Set development mode
   */
  dev?: boolean
  /**
   * Allow server-side-rendering
   */
  ssr?: boolean
  /**
   * Config registry server endpoint
   */
  registry?: string
  /**
   * Compose of application
   */
  compose?: string
  /**
   * Linked info, use for workspace
   */
  linked?: LinkedConfig
  /**
   * Defined modules to resolve in runtime
   */
  modules?: ModulesConfig
  /**
   * Defined vendors dependencies
   */
  vendors?: VendorsConfig
  /**
   * Defined shared dependencies
   */
  shared?: SharedConfig
  /**
   * Allow preload modules in runtime, only support in browser
   */
  preload?: string[]
  /**
   * Warnings
   */
  warnings?: WarningsConfig[]
  /**
   * Enable global mode
   */
  global?: boolean
}

export interface WarningsConfig {
  id: string
  module: string
  code: string
  message: string
}

export interface LiveConfig {
  url: string
  integrity?: string
  timeout?: number
  retries?: number
}
