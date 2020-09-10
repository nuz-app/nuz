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
  feature?: boolean | FeaturesUsed
  /**
   * Bundle analyzer for production mode
   */
  analyzer?: boolean | AnalyzerConfiguration
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
  registry?: RegistryConfiguration
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
  serve?: ServeConfiguration
  /**
   * Experimental
   */
  experimental?: ExperimentalConfiguration
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
  names?: Partial<NamedConfiguration>
}

export interface NamedConfiguration {
  chunkFilename: () => string
  cssLocalIdentName: () => string
  cssFilename: () => string
  cssChunkFilename: () => string
  imageMinifiedFilename: (resourcePath: string) => string
}

export interface FeaturesUsed {
  typescript: boolean
  react: boolean
  postcss: boolean | any

  css: boolean | any
  modules: boolean | RegExp | 'auto'
  sass: boolean | any
  less: boolean | any
}
