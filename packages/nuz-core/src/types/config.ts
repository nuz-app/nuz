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
   * Turn on developer mode,
   * if not configured, it will be the value of the current environment.
   */
  dev?: boolean
  /**
   * Support server-side rendering
   */
  ssr?: boolean
  /**
   * Configure the registry endpoint,
   * the default will be the Nuz Services server.
   */
  registry?: string
  /**
   * Declare compose to use for the application
   */
  compose?: string
  /**
   * Information about server dev workspaces
   */
  linked?: LinkedConfig
  /**
   * Declare detailed information the modules used
   */
  modules?: ModulesConfig
  /**
   * Declare vendors dependencies
   */
  vendors?: VendorsConfig
  /**
   * Declare shared dependencies
   */
  shared?: SharedConfig
  /**
   * Support preloading the modules
   */
  preload?: string[]
  /**
   * The warnings returned from the server
   */
  warnings?: WarningsConfig[]
  /**
   * Turn on the mode that allows you to resolve information
   * from the server if it can't be found internally.
   */
  global?: boolean
  /**
   * Configure where to store and execute code.
   */
  context?: string | false
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
