import webpack = require('webpack')
import { Argv } from 'yargs'

export enum CommandTypes {
  create = 'create',
  dev = 'dev',
  build = 'build',
  serve = 'serve',
}

export interface CommandConfig<C = unknown> {
  type: CommandTypes
  description: string
  transform: (yargs: any) => any
  execute: (yargs: Argv<C>) => Promise<any>
}

export interface CreateConfig {
  name: string
  template: string
}

export interface DevConfig {
  port: number
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
}

export interface FeatureConfig {
  typescript: boolean
  react: boolean
  postcss: boolean | any

  css: boolean | any
  sass: boolean | any
  less: boolean | any
}
