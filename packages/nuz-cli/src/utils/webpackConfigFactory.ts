import os from 'os'
import path from 'path'
import webpack from 'webpack'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WebpackProcessBar from 'webpackbar'

import { AnalyzerConfig, FeatureConfig, ModuleConfig } from '../types'

import {
  CSS_EXTENSIONS,
  JSON_EXTENSIONS,
  JS_EXTENSIONS,
  LESS_EXTENSIONS,
  SASS_EXTENSIONS,
  STATS_FILENAME,
  TS_EXTENSIONS,
} from '../lib/const'

import getPackageJsonTool from './getPackageJsonTool'
import * as paths from './paths'

export interface FactoryConfig {
  ci?: boolean
  dir: string
  dev: boolean
  cache: boolean
  config: ModuleConfig
}

const ruleFactory = (test: RegExp, exclude?: RegExp) => ({
  test,
  exclude,
  use: [],
})

const defaultConfig = {
  publicPath: '/',
  format: 'umd' as webpack.LibraryTarget,
  // ref: https://github.com/webpack/webpack/issues/2145#issuecomment-294361203
  // suggested: `cheap-module-source-map`
  devtool: 'eval-source-map' as webpack.Options.Devtool,
  externals: {},
}

const webpackConfigFactory = (
  { dev, dir, cache, ci = false, config: moduleConfig }: FactoryConfig,
  feature: Partial<FeatureConfig> = {},
) => {
  const {
    library,
    format,
    devtool,
    input,
    externals,
    output,
    publicPath,
    analyzer,
    webpack: customWebpack,
  } = Object.assign({}, defaultConfig, moduleConfig)

  const target = 'web'
  const sourceMap = !!devtool
  const mode = dev ? 'development' : 'production'
  const bail = !dev
  const inputFile = path.join(dir, input)
  const distPath = path.join(dir, path.dirname(output))
  const distFile = path.basename(output)
  const umdNamedDefine = format === 'umd'
  const scriptType = 'text/javascript'
  const loadTimeout = 120000
  const globalObject = `(typeof self !== 'undefined' ? self : this)`
  const mainFields = ['browser', 'module', 'main']
  const resolveModules = ['node_modules']
  const statsFilename = STATS_FILENAME
  const packageJsonTool = getPackageJsonTool() || {}

  const extensions = feature.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  const cacheConfig = cache && {
    type: 'filesystem',
    cacheDirectory: paths.cache('webpack'),
    hashAlgorithm: 'md4',
  }

  const config: webpack.Configuration = {
    name: packageJsonTool.name + '-webpack',
    bail,
    mode,
    target,
    devtool,
    cache: cacheConfig,
    context: dir,
    entry: inputFile,
    output: {
      library,
      umdNamedDefine,
      globalObject,
      publicPath,
      path: distPath,
      filename: distFile,
      libraryTarget: format,
      chunkLoadTimeout: loadTimeout,
      jsonpScriptType: scriptType,
    },
    resolve: {
      extensions,
      mainFields,
      modules: resolveModules,
    },
    externals: { ...externals },
    module: {
      rules: [],
    },
    plugins: [],
    optimization: {
      namedModules: true,
    },
  }

  // Push process bar handler to plugins
  config.plugins.push(
    new WebpackProcessBar({
      name: packageJsonTool.name,
      fancy: !ci,
    }),
  )

  if (feature.react) {
    Object.assign(config.externals, {
      react: 'React',
      'react-dom': 'ReactDOM',
    })
  }

  // Config babel and typescript to transplie scripts
  const ruleOfScripts = ruleFactory(
    feature.typescript ? /.tsx?/ : /.jsx?/,
    /(node_modules|bower_components)/,
  )

  // Set cache loader to improve build time
  ruleOfScripts.use.push({ loader: require.resolve('cache-loader') })

  // Set thread loader to use child process
  ruleOfScripts.use.push({
    loader: require.resolve('thread-loader'),
    options: {
      workers: Math.max(1, os.cpus().length - 1),
      poolTimeout: !dev ? 500 : Infinity,
    },
  })

  // Set babel loader to transplie es
  ruleOfScripts.use.push({
    loader: require.resolve('babel-loader'),
    options: {
      cacheDirectory: cache,
      presets: [
        require.resolve('@babel/preset-env'),
        feature.react && require.resolve('@babel/preset-react'),
      ].filter(Boolean),
      plugins: [require.resolve('@babel/plugin-transform-runtime')],
    },
  })

  // Set typescript loader to transplie ts
  if (feature.typescript) {
    ruleOfScripts.use.push({
      loader: require.resolve('ts-loader'),
      options: {
        context: dir,
        happyPackMode: true,
        transpileOnly: true,
        colors: !ci,
      },
    })

    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({ silent: false, async: false }),
    )
  }

  // Push scripts rule to config
  config.module.rules.push(ruleOfScripts)

  const shouldUseIncludeStyles = [
    feature.css,
    feature.less,
    feature.sass,
    feature.postcss,
  ].some(Boolean)
  if (shouldUseIncludeStyles) {
    const stylesExt = []
      .concat(
        feature.css && CSS_EXTENSIONS, // always true
        feature.sass && SASS_EXTENSIONS,
        feature.less && LESS_EXTENSIONS,
      )
      .filter(Boolean)
    const testOfStyles = new RegExp(`(${stylesExt.join('|')})$`)
    const ruleOfStyles = ruleFactory(testOfStyles)

    if (feature.css) {
      // Set styles loader for preprocessor
      ruleOfStyles.use.push({
        loader: require.resolve('style-loader'),
      })

      // Set css loader
      ruleOfStyles.use.push({
        loader: require.resolve('css-loader'),
        options: Object.assign(
          {
            modules: true,
          },
          feature.css,
          { importLoaders: 1 },
        ),
      })
    }

    if (feature.postcss) {
      // Set postcss loader
      ruleOfStyles.use.push(
        Object.assign(
          {
            loader: require.resolve('postcss-loader'),
          },
          feature.postcss !== true && { options: feature.postcss },
        ),
      )
    }

    if (feature.sass) {
      // Set sass loader
      ruleOfStyles.use.push(
        Object.assign(
          {
            loader: require.resolve('sass-loader'),
          },
          feature.sass !== true && { options: feature.sass },
        ),
      )
    }

    if (feature.less) {
      // Set less loader
      ruleOfStyles.use.push(
        Object.assign(
          {
            loader: require.resolve('less-loader'),
          },
          feature.less !== true && { options: feature.less },
        ),
      )
    }

    // Push styles rule to config
    config.module.rules.push(ruleOfStyles)
  }

  // Config optimization for production mode
  if (!dev) {
    // Push bundle analyzer for production mde
    const analyzerConfig = (analyzer || {}) as AnalyzerConfig
    const statsOptions = Object.assign({}, analyzerConfig.statsOptions, {
      hash: true,
      builtAt: true,
      entrypoints: true,
      assets: true,
    })
    // config.plugins.push(
    //   new BundleAnalyzerPlugin({
    //     statsFilename,
    //     generateStatsFile: true,
    //     analyzerMode: 'static',
    //     analyzerPort: 'auto',
    //     statsOptions,
    //     openAnalyzer: !!analyzerConfig.open,
    //   }),
    // )

    Object.assign(config.optimization, {
      minimizer: [
        new TerserPlugin({
          sourceMap,
          cache: true,
          parallel: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: true,
        automaticNameDelimiter: '~',
        maxSize: 1024 * 1024,
        automaticNameMaxLength: 40,
        maxInitialRequests: 3,
        minChunks: 1,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    })
  } else {
    Object.assign(config.optimization, {
      splitChunks: false,
    })
  }

  const customIsFn = typeof customWebpack === 'function'
  return customIsFn ? customWebpack(config) : config
}

export default webpackConfigFactory