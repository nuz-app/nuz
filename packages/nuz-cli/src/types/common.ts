import webpack = require('webpack')
import * as yargs from 'yargs'

export enum CommandTypes {
  create = 'create',
  dev = 'dev',
  build = 'build',
  serve = 'serve',
  publish = 'publish',
  workspace = 'workspace',
}

export interface PublishConfig {
  token: string
  endpoint: string
}

export interface CommandConfig<C = unknown> {
  type: CommandTypes
  description: string
  transform: (yargs: any) => any
  execute: (yargs: yargs.Argv<C>) => Promise<any>
}

export interface CreateCommand {
  name?: string
  template?: string
}

export interface PublishCommand {
  fallback?: boolean
}

export interface BuildCommand {
  clean?: boolean
}

export interface DevCommand {
  port?: number
}

export interface ServeCommand {
  port?: number
}

export interface WorkspaceCommand {
  workspace?: string[]
}

export interface AnalyzerConfig {
  open: boolean
  statsOptions?: { [key: string]: any }
}

export interface ModuleConfig {
  /**
   * Name of module
   */
  name: string
  /**
   * Version of module
   */
  version: string
  /**
   * Library name
   */
  library: string
  /**
   * Input file
   */
  input: string
  /**
   * Output file
   */
  output: string
  /**
   * Public path using in build, default: '/'
   */
  publicPath: string
  /**
   * Extends externals module
   */
  externals?: { [moduleName: string]: string }
  /**
   * Enable feature by loader and plugins
   */
  feature?: boolean | FeatureConfig
  /**
   * Bundle analyzer for production mode
   */
  analyzer?: boolean | AnalyzerConfig
  /**
   * Allow to custom webpack config
   */
  webpack?: (config: webpack.Configuration) => webpack.Configuration
  /**
   * Publish config
   */
  publishConfig?: PublishConfig
  /**
   * Workspace paths
   */
  workspace?: string[]
}

export interface FeatureConfig {
  typescript: boolean
  react: boolean
  postcss: boolean | any

  css: boolean | any
  sass: boolean | any
  less: boolean | any
}
