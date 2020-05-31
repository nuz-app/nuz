// @ts-ignore
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

export interface RegistryConfig {
  /**
   * Access token
   */
  token: string
  /**
   * Registry endpoint
   */
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
  clean?: boolean
}

export interface ServeCommand {
  port?: number
}

export interface WorkspaceCommand {
  workspace?: string[]
  port?: number
  clean?: boolean
}

export interface AnalyzerConfig {
  open: boolean
  statsOptions?: { [key: string]: any }
}

export interface ServeHttpsConfig {
  key: Buffer | string
  cert: Buffer | string
}

export interface ServeConfig {
  https?: boolean | ServeHttpsConfig
}

export interface ExperimentalConfig {
  multiThread?: boolean
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
  externals?: webpack.ExternalsElement | webpack.ExternalsElement[]
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
  webpack?: (
    config: webpack.Configuration,
  ) => Required<
    Pick<
      webpack.Configuration,
      'name' | 'mode' | 'target' | 'entry' | 'output' | 'module'
    >
  >
  /**
   * Publish config
   */
  registry?: RegistryConfig
  /**
   * Workspace paths
   */
  workspace?: string[]
  /**
   * Shared dependencies module used
   */
  shared?: string[]
  /**
   * Serve config
   * Config using for dev, serve and workspace mode
   */
  serve?: ServeConfig
  /**
   * Experimental
   */
  experimental?: ExperimentalConfig
  /**
   * Build isolated module
   */
  isolated?: boolean
  /**
   * Alias modules resolve
   */
  alias?: { [name: string]: string }
  /**
   * Filenames of webpack plugins
   */
  names?: Partial<NamesConfig>
}

export interface NamesConfig {
  chunkFilename: () => string
  cssLocalIdentName: () => string
  cssFilename: () => string
  cssChunkFilename: () => string
  imageMinifiedFilename: (resourcePath: string) => string
}

export interface FeatureConfig {
  typescript: boolean
  react: boolean
  postcss: boolean | any

  css: boolean | any
  modules: boolean | RegExp | 'auto'
  sass: boolean | any
  less: boolean | any
}
