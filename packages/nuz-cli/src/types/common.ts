import type webpack from 'webpack'

export interface RegistryConfiguration {
  /**
   * Access token
   */
  token: string
  /**
   * Registry endpoint
   */
  endpoint: string
}

export interface AnalyzerConfiguration {
  open: boolean
  statsOptions?: { [key: string]: any }
}

export interface ServeHttpsConfiguration {
  key: Buffer | string
  cert: Buffer | string
}

export interface ServeConfiguration {
  https?: boolean | ServeHttpsConfiguration
}

export interface ExperimentalConfiguration {
  multiThread?: boolean
}

export interface InternalConfiguration {
  /**
   * The module name.
   */
  name: string
  /**
   * The module version.
   */
  version: string
  /**
   * The library name
   */
  library: string
  /**
   * Path to the module input file.
   */
  input: string
  /**
   * Path to the module output file.
   */
  output: string
  /**
   * Configure the public path for the module.
   */
  publicPath: string
  /**
   * Set externals dependencies for the module.
   */
  externals?: webpack.ExternalsElement | webpack.ExternalsElement[]
  /**
   * Set features used for the module.
   */
  featuresUsed?: boolean | FeaturesUsed
  /**
   * Allows to output analyzer for the mobule.
   */
  analyzer?: boolean | AnalyzerConfiguration
  /**
   * Configure the registry service information.
   */
  registry?: RegistryConfiguration
  /**
   * Configure workspaces paths for workspaces mode,
   * only for the applocation.
   */
  workspaces?: string[]
  /**
   * Set shared dependencies for the module.
   */
  shared?: string[]
  /**
   * Configure experimental features.
   */
  experimental?: ExperimentalConfiguration
  /**
   * Is build module isolated configuration.
   */
  isolated?: boolean
  /**
   * Configure exports for the module.
   */
  alias?: { [name: string]: string }
  /**
   * Additional node modules paths
   */
  additionalNodeModules?: string[]
  /**
   * Allows to extends Webpack aliases
   */
  webpackAliases?: any
  /**
   * Allows to update Webpack configuration.
   */
  webpack?: (
    config: webpack.Configuration,
  ) => Required<
    Pick<
      webpack.Configuration,
      'name' | 'mode' | 'target' | 'entry' | 'output' | 'module'
    >
  >
}

export interface FeaturesUsed {
  typescript: boolean
  react: boolean
  postcss: boolean | any

  css: boolean | any
  sass: boolean | any
  less: boolean | any
}
