import os from 'os'
import path from 'path'
import webpack from 'webpack'

import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WebpackProcessBar from 'webpackbar'

import {
  AnalyzerConfig,
  ExperimentalConfig,
  FeatureConfig,
  ModuleConfig,
} from '../types'

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
import * as fs from './fs'
import * as paths from './paths'

import styleLoadersFactory from './webpack/factories/styleLoaders'
import setExternals from './webpack/helpers/setExternals'
import PeerDepsExternalsPlugin from './webpack/PeerDepsExternalsPlugin'

export interface FactoryConfig {
  ci?: boolean
  module?: string
  dir: string
  dev: boolean
  cache: boolean
  config: ModuleConfig
}

const TYPESCRIPT_REGEXP = /.tsx?/
const JAVASCRIPT_REGEXP = /.jsx?/
const IMAGE_REPGEXP = /\.(png|jpe?g|gif)$/i
const SVG_REPGEXP = /\.svg$/i
const IMAGE_MINIFY_REGEXP = /(\.min\.(png|jpe?g|gif|svg))$/i

const ruleFactory = (
  test: RegExp,
  exclude?: RegExp,
  use?: any[],
): webpack.RuleSetRule & { use: webpack.RuleSetUseItem[] } => ({
  test,
  exclude,
  use: use || [],
})

const defaultConfig = {
  isolated: false,
  publicPath: '/',
  format: 'umd' as webpack.LibraryTarget,
  experimental: {},
  externals: {},
  // ref: https://github.com/webpack/webpack/issues/2145#issuecomment-294361203
  // suggested: `eval-source-map` (dev), `hidden-source-map` (pro)
  // devtool: 'eval-source-map' as webpack.Options.Devtool,
}

const defaultExperimental: ExperimentalConfig = {
  multiThread: false,
}

const webpackConfigFactory = (
  {
    dev,
    dir,
    cache = true,
    ci = false,
    module = '~',
    config: moduleConfig,
  }: FactoryConfig,
  feature: Partial<FeatureConfig> = {},
) => {
  const {
    isolated,
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
    experimental: experimentalCustomer,
  } = Object.assign({}, defaultConfig, moduleConfig)

  const experimental = Object.assign(
    {},
    defaultExperimental,
    experimentalCustomer,
  )

  const target = 'web'
  const mode = dev ? 'development' : 'production'
  const devtool = !devtoolCustomer
    ? dev
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
  const now = Date.now()

  const extensions = feature.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  const cacheDirectories = {
    bundles: (paths as any).cache('bundles'),
    babel: (paths as any).cache('babel'),
    terser: (paths as any).cache('terser'),
    images: (paths as any).cache('images'),
  }
  const cacheConfig = cache
    ? {
        type: 'filesystem',
        cacheDirectory: cacheDirectories.bundles,
        hashAlgorithm: 'md4',
      }
    : false

  const resolveInApp = (moduleId: string) => paths.resolveInApp(moduleId, dir)

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
      react: setExternals('react', isolated),
      'react-dom': setExternals('react-dom', isolated),
    })
  }

  if (Array.isArray(shared) && shared.length > 0) {
    const sharedExternals = shared.reduce(
      (acc, item) =>
        Object.assign(acc, { [item]: setExternals(item, isolated) }),
      {},
    )

    config.externals.push(sharedExternals)
  }

  const nextIsInstalled = checkIsPackageInstalled('next', dir)
  if (nextIsInstalled) {
    const sharedNextModules = [
      'next/dynamic',
      'next/router',
      'next/link',
      'next/head',
      'next/amp',
    ]

    const nextExternals = sharedNextModules.reduce(
      (acc, item) =>
        Object.assign(acc, { [item]: setExternals(item, isolated) }),
      {},
    )

    config.externals.push(nextExternals)
  }

  // Config babel and typescript to transplie scripts
  const scriptRule = ruleFactory(
    feature.typescript ? TYPESCRIPT_REGEXP : JAVASCRIPT_REGEXP,
    /(node_modules|bower_components)/,
  )

  if (experimental.multiThread) {
    // Set thread loader to use child process
    scriptRule.use.push({
      loader: resolveInApp('thread-loader'),
      options: {
        workers: Math.max(1, os.cpus().length - 1),
        poolTimeout: !dev ? 2000 : Infinity,
      },
    })
  }

  // Set babel loader to transplie es
  scriptRule.use.push({
    loader: resolveInApp('babel-loader'),
    options: {
      cacheDirectory: cache ? cacheDirectories.babel : false,
      presets: [
        resolveInApp('@babel/preset-env'),
        feature.react && resolveInApp('@babel/preset-react'),
      ].filter(Boolean),
      plugins: [resolveInApp('@babel/plugin-transform-runtime')],
    },
  })

  // Set typescript loader to transplie ts
  if (feature.typescript) {
    const typescriptIsInstalled = checkIsPackageInstalled('typescript', dir)
    if (!typescriptIsInstalled) {
      throw new Error('Install `typescript` to use Typescript!')
    }

    scriptRule.use.push({
      loader: resolveInApp('ts-loader'),
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
  config.module.rules.push(scriptRule)

  const shouldUseIncludeStyles = [
    feature.css,
    feature.postcss,
    feature.less,
    feature.sass,
  ].some(Boolean)
  if (shouldUseIncludeStyles) {
    const supportedStyleExtensions = ([] as any[])
      .concat(
        feature.css && CSS_EXTENSIONS,
        feature.sass && SASS_EXTENSIONS,
        feature.less && LESS_EXTENSIONS,
      )
      .filter(Boolean)
    // Create style loaders for modules styles if enabled
    const modulesStyleExtensions = supportedStyleExtensions.map(
      (ext) => `(.m(odules?)?${ext})`,
    )
    const modulesStyleRegexp = new RegExp(
      `(${modulesStyleExtensions.join('|')})$`,
    )
    const modulesStyleLoaders = styleLoadersFactory({
      dir,
      dev,
      feature,
      modules: true,
    })
    const modulesStyleRule = ruleFactory(
      modulesStyleRegexp,
      undefined,
      modulesStyleLoaders,
    )
    config.module.rules.push(modulesStyleRule)

    // Create style loaders for regular styles
    const regularStyleExtensions = supportedStyleExtensions
    const regularStyleRegexp = new RegExp(
      `(${regularStyleExtensions.join('|')})$`,
    )
    const regularStyleLoaders = styleLoadersFactory({
      dir,
      dev,
      feature,
      modules: false,
    })
    const regularStyleRule = ruleFactory(
      regularStyleRegexp,
      modulesStyleRegexp,
      regularStyleLoaders,
    )

    config.module.rules.push(regularStyleRule)

    // Push ExtractCssChunks plugin for regular and modules styles
    config.plugins.push(
      new ExtractCssChunks({
        dev,
        filename: dev
          ? 'styles/[name].css'
          : 'styles/[name].[contenthash:8].css',
        chunkFilename: dev
          ? 'styles/[name].chunk.css'
          : 'styles/[name].[contenthash:8].chunk.css',
      }),
    )
  }

  // Optimized images in production mode
  const optimizedImagesRule = ruleFactory(IMAGE_MINIFY_REGEXP)
  optimizedImagesRule.enforce = 'pre'
  if (cache) {
    optimizedImagesRule.use.push({
      loader: resolveInApp('cache-loader'),
      options: {
        cacheDirectory: cacheDirectories.images,
        cacheContext: dir,
      },
    })
  }
  optimizedImagesRule.use.push({
    loader: resolveInApp('image-webpack-loader'),
    options: {
      mozjpeg: {
        progressive: true,
        quality: 80,
      },
      optipng: {
        optimizationLevel: 3,
      },
      pngquant: {
        quality: [0.75, 0.9],
        speed: 4,
      },
      gifsicle: {
        interlaced: false,
      },
      webp: {
        quality: 80,
      },
    },
  })
  config.module.rules.push(optimizedImagesRule)

  // Config `url-loader` and `file-loader` to use images files
  const imagesRule = ruleFactory(IMAGE_REPGEXP)
  config.module.rules.push(imagesRule)

  const imagesLoader = {
    loader: resolveInApp('url-loader'),
    options: {
      limit: 5 * 1024,
      fallback: resolveInApp('file-loader'),
      context: dir,
      outputPath: 'images',
      name: (resourcePath: string) => {
        const imageAllowMinify = IMAGE_MINIFY_REGEXP.test(resourcePath)
        if (imageAllowMinify) {
          const filename = path
            .basename(resourcePath)
            .replace(IMAGE_MINIFY_REGEXP, '')

          return dev
            ? `${filename}.[contenthash:8].min.[ext]`
            : `${filename}.[contenthash].min.[ext]`
        }

        return dev
          ? `[name].[contenthash:8].[ext]`
          : `[name].[contenthash].[ext]`
      },
      emitFile: true,
    },
  }
  imagesRule.use.push(imagesLoader)

  // Config loaders to use svg files as components and image files
  const svgRule = ruleFactory(SVG_REPGEXP)
  svgRule.use.push(
    {
      loader: resolveInApp('@svgr/webpack'),
    },
    imagesLoader,
  )
  config.module.rules.push(svgRule)

  // Config `raw-loader` to use txt files
  const textRule = ruleFactory(/\.txt$/i)
  textRule.use.push({
    loader: resolveInApp('raw-loader'),
  })

  // Set peers deps as externals
  config.plugins.push(new PeerDepsExternalsPlugin(dir, isolated))

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

    const terserOptions = {
      mangle: { safari10: true },
      output: {
        ecma: 5 as any,
        safari10: true,
        comments: false,
        ascii_only: true,
      },
    }

    Object.assign(config.optimization, {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap,
          terserOptions,
          cache: cache ? cacheDirectories.terser : false,
          parallel: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: true,
        automaticNameDelimiter: '~',
        maxSize: 1024 * 1024,
        automaticNameMaxLength: 40,
        maxInitialRequests: 5,
        minChunks: 1,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
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
      minimize: false,
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
