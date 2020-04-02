import { DEPENDENCIES_KEY } from '@nuz/shared'
import os from 'os'
import path from 'path'
import webpack from 'webpack'

import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
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

import checkIsPackageInstalled from './checkIsPackageInstalled'
import * as compilerName from './compilerName'
import * as paths from './paths'

import PeerDepsExternalsPlugin from './webpack/PeerDepsExternalsPlugin'

export interface FactoryConfig {
  ci?: boolean
  module?: string
  dir: string
  dev: boolean
  cache: boolean
  config: ModuleConfig
}

const ruleFactory = (test: RegExp, exclude?: RegExp) => ({
  test,
  exclude,
  use: [] as any[],
})

const setExternals = (name: string) => ({
  commonjs: [DEPENDENCIES_KEY, name],
  commonjs2: [DEPENDENCIES_KEY, name],
  root: [DEPENDENCIES_KEY, name],
})

const defaultConfig = {
  publicPath: '/',
  format: 'umd' as webpack.LibraryTarget,
  externals: {},
  // ref: https://github.com/webpack/webpack/issues/2145#issuecomment-294361203
  // suggested: `eval-source-map` (dev), `hidden-source-map` (pro)
  // devtool: 'eval-source-map' as webpack.Options.Devtool,
}

const webpackConfigFactory = (
  {
    dev,
    dir,
    cache,
    ci = false,
    module = '~',
    config: moduleConfig,
  }: FactoryConfig,
  feature: Partial<FeatureConfig> = {},
) => {
  const {
    library,
    format,
    input,
    externals,
    output,
    publicPath,
    analyzer,
    shared,
    webpack: webpackCustomer,
    devtool: devtoolCustomer,
  } = Object.assign({}, defaultConfig, moduleConfig)

  const target = 'web'
  const mode = dev ? 'development' : 'production'
  const devtool = !devtoolCustomer
    ? mode
      ? 'eval-source-map'
      : 'hidden-source-map'
    : devtoolCustomer
  const sourceMap = !!devtool
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
  const name = compilerName.get(module)

  const extensions = feature.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  const cacheConfig = cache && {
    type: 'filesystem',
    cacheDirectory: (paths as any).cache('bundles'),
    hashAlgorithm: 'md4',
  }

  const config = {
    name,
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
      alias: {},
    },
    externals: [externals],
    module: {
      rules: [] as any[],
    },
    plugins: [] as any[],
    optimization: {
      namedModules: true,
    },
  }

  // Push process bar handler to plugins
  config.plugins.push(
    new WebpackProcessBar({
      name,
      color: 'green',
    }),
  )

  if (feature.react) {
    // tslint:disable-next-line: prettier
    (config.externals as webpack.ExternalsElement[]).push({
      react: setExternals('react'),
      'react-dom': setExternals('react-dom'),
    })
  }

  if (Array.isArray(shared) && shared.length > 0) {
    const sharedExternals = shared.reduce(
      (acc, item) => Object.assign(acc, { [item]: setExternals(item) }),
      {},
    )

    // @ts-ignore
    config.externals.push(sharedExternals)
  }

  // Config babel and typescript to transplie scripts
  const ruleOfScripts = ruleFactory(
    feature.typescript ? /.tsx?/ : /.jsx?/,
    /(node_modules|bower_components)/,
  )

  // Set cache loader to improve build time
  ruleOfScripts.use.push({ loader: paths.resolveInApp('cache-loader') })

  // Set thread loader to use child process
  ruleOfScripts.use.push({
    loader: paths.resolveInApp('thread-loader'),
    options: {
      workers: Math.max(1, os.cpus().length - 1),
      poolTimeout: !dev ? 500 : Infinity,
    },
  })

  // Set babel loader to transplie es
  ruleOfScripts.use.push({
    loader: paths.resolveInApp('babel-loader'),
    options: {
      cacheDirectory: cache,
      presets: [
        paths.resolveInApp('@babel/preset-env'),
        feature.react && paths.resolveInApp('@babel/preset-react'),
      ].filter(Boolean),
      plugins: [paths.resolveInApp('@babel/plugin-transform-runtime')],
    },
  })

  // Set typescript loader to transplie ts
  if (feature.typescript) {
    const typescriptIsInstalled = checkIsPackageInstalled('typescript')
    if (!typescriptIsInstalled) {
      throw new Error('Install `typescript` to use Typescript!')
    }

    ruleOfScripts.use.push({
      loader: paths.resolveInApp('ts-loader'),
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
    config.plugins.push(new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]))
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
    const stylesExt = ([] as any[])
      .concat(
        feature.css && CSS_EXTENSIONS, // always true
        feature.sass && SASS_EXTENSIONS,
        feature.less && LESS_EXTENSIONS,
      )
      .filter(Boolean)
    const testOfStyles = new RegExp(`(${stylesExt.join('|')})$`)
    const ruleOfStyles = ruleFactory(testOfStyles)

    if (feature.css) {
      // Set ExtractCssChunks loader for preprocessor
      ruleOfStyles.use.push({
        loader: ExtractCssChunks.loader,
        options: {
          hmr: dev,
        },
      })

      config.plugins.push(
        new ExtractCssChunks({
          filename: dev
            ? 'styles/[name].css'
            : 'styles/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'styles/[name].chunk.css'
            : 'styles/[name].[contenthash:8].chunk.css',
          dev,
        }),
      )

      // Set css loader
      ruleOfStyles.use.push({
        loader: paths.resolveInApp('css-loader'),
        options: Object.assign(
          {
            modules: true,
            importLoaders: 1,
          },
          feature.css,
        ),
      })
    }

    if (feature.postcss) {
      // Set postcss loader
      ruleOfStyles.use.push({
        loader: paths.resolveInApp('postcss-loader'),
        options: feature.postcss === true ? {} : feature.postcss,
      })
    }

    if (feature.sass) {
      const nodeSassIsInstalled = checkIsPackageInstalled('node-sass')
      const dartSassIsInstalled = checkIsPackageInstalled('dart-sass')
      const sassIsInstalled = nodeSassIsInstalled || dartSassIsInstalled
      if (!sassIsInstalled) {
        throw new Error('Install `node-sass` or `dart-sass` to use Sass!')
      }

      // Set sass loader
      ruleOfStyles.use.push({
        loader: paths.resolveInApp('sass-loader'),
        options: feature.sass === true ? {} : feature.sass,
      })
    }

    if (feature.less) {
      const lessIsInstalled = checkIsPackageInstalled('less')
      if (!lessIsInstalled) {
        throw new Error('Install `less` to use Less!')
      }

      // Set less loader
      ruleOfStyles.use.push({
        loader: paths.resolveInApp('less-loader'),
        options: feature.less === true ? {} : feature.less,
      })
    }

    // Push styles rule to config
    config.module.rules.push(ruleOfStyles)
  }

  // Set peers deps as externals
  config.plugins.push(new PeerDepsExternalsPlugin(dir))

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
    config.plugins.push(
      new BundleAnalyzerPlugin({
        statsFilename,
        generateStatsFile: true,
        analyzerMode: 'static',
        analyzerPort: 'auto',
        statsOptions,
        openAnalyzer: !!analyzerConfig.open,
      }),
    )

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

  if (typeof webpackCustomer === 'function') {
    const customConfig = webpackCustomer(config as webpack.Configuration)

    if (!customConfig.output) {
      throw new Error('Webpack config is missing output field')
    }

    return customConfig
  }

  return config
}

export default webpackConfigFactory
