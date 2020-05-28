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
  NamesConfig,
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

import * as paths from '../paths'
import checkIsPackageInstalled from './checkIsPackageInstalled'
import * as compilerName from './compilerName'

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
const JAVASCRIPT_REGEXP = /.m?jsx?/
const IMAGE_REGEXP = /\.(png|jpe?g|gif)$/i
const SVG_REGEXP = /\.svg$/i
const IMAGE_MINIFY_REGEXP = /(\.min\.(png|jpe?g|gif|svg))$/i
const TEXT_REGEXP = /\.txt$/i

const ruleFactory = (
  test: RegExp,
  exclude?: RegExp,
  use?: any[],
): webpack.RuleSetRule & { use: webpack.RuleSetUseItem[] } => ({
  test,
  exclude,
  use: use || [],
})

const getOutput = (dir: string, output: string) => {
  const distDir = path.isAbsolute(output)
    ? path.dirname(output)
    : path.join(dir, path.dirname(output))
  const distFilename = path.basename(output)

  return {
    directory: distDir,
    filename: distFilename,
  }
}

const defaultConfig = {
  isolated: false,
  publicPath: '/',
  format: 'umd' as webpack.LibraryTarget,
  experimental: {},
  externals: {},
  alias: {},
}

const defaultExperimental: ExperimentalConfig = {
  multiThread: false,
}

const defaultNamesFactory = (dev: boolean): NamesConfig => ({
  imageMinifiedFilename: (resourcePath: string) => {
    const imageAllowMinify = IMAGE_MINIFY_REGEXP.test(resourcePath)
    if (imageAllowMinify) {
      const filename = path
        .basename(resourcePath)
        .replace(IMAGE_MINIFY_REGEXP, '')

      return dev
        ? `${filename}.[contenthash:8].min.[ext]`
        : `${filename}.[contenthash].min.[ext]`
    }

    return dev ? `[name].[contenthash:8].[ext]` : `[name].[contenthash].[ext]`
  },
  chunkFilename: () => '[name]-[contenthash].js',
  cssLocalIdentName: () =>
    dev ? '[name]-[local]-[hash:base64:6]' : '[contenthash:8]',
  cssFilename: () =>
    dev ? 'styles/[name].css' : 'styles/[name].[contenthash:8].css',
  cssChunkFilename: () =>
    dev ? 'styles/[name].chunk.css' : 'styles/[name].[contenthash:8].chunk.css',
})

function webpackConfigFactory(
  {
    dev,
    dir,
    cache = true,
    ci = false,
    module = '~',
    config: moduleConfig,
  }: FactoryConfig,
  feature: Partial<FeatureConfig> = {},
) {
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
    alias,
    names: namesCustomer,
    webpack: webpackCustomer,
    experimental: experimentalCustomer,
  } = Object.assign({}, defaultConfig, moduleConfig)

  const experimental = Object.assign(
    {},
    defaultExperimental,
    experimentalCustomer,
  )
  const names = Object.assign({}, defaultNamesFactory(dev), namesCustomer)

  const target = 'web'
  const mode = dev ? 'development' : 'production'
  const sourceMap = true
  const bail = !dev
  const inputFile = path.join(dir, input)
  const { directory: distDir, filename: distFilename } = getOutput(dir, output)
  const distChunkFilename = names.chunkFilename()
  const umdNamedDefine = format === 'umd'
  const scriptType = 'text/javascript'
  const loadTimeout = 120000
  const globalObject = `(typeof self !== 'undefined' ? self : this)`
  const mainFields = ['browser', 'module', 'main']
  const requireModules = ['node_modules']
  const statsFilename = STATS_FILENAME
  const name = compilerName.get(module)

  const extensions = feature.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  const cacheDirectories = {
    bundles: (paths as any).cacheInApp('bundles'),
    babel: (paths as any).cacheInApp('babel'),
    terser: (paths as any).cacheInApp('terser'),
    images: (paths as any).cacheInApp('images'),
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
    devtool: false,
    cache: cacheConfig,
    context: dir,
    entry: inputFile,
    output: {
      // Ref https://github.com/webpack/webpack/issues/959#issuecomment-546506221
      library: library || '[name]',
      umdNamedDefine,
      globalObject,
      publicPath,
      path: distDir,
      filename: distFilename,
      libraryTarget: format,
      chunkLoadTimeout: loadTimeout,
      jsonpScriptType: scriptType,
      chunkFilename: distChunkFilename,
    },
    resolve: {
      extensions,
      mainFields,
      alias,
      modules: requireModules,
    },
    externals: [externals],
    module: {
      rules: [] as any[],
    },
    plugins: [] as any[],
    optimization: {
      namedModules: true,
      usedExports: true,
      splitChunks: false,
    },
  }

  // Push process bar handler to plugins
  config.plugins.push(
    new WebpackProcessBar({
      name,
      color: 'green',
    }),
  )

  // Push source maps builder to plugins
  const sourceMapsPlugins = dev
    ? [
        new webpack.SourceMapDevToolPlugin({
          test: /\.css$/,
        }),
        new webpack.EvalSourceMapDevToolPlugin({
          // @ts-ignore
          test: /.js$/,
        }),
      ]
    : [
        new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          publicPath,
        }),
      ]
  config.plugins.push(...sourceMapsPlugins)

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
    /node_modules/,
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
      ].filter(Boolean) as string[],
      plugins: [
        resolveInApp('@babel/plugin-syntax-dynamic-import'),
        resolveInApp('@babel/plugin-transform-runtime'),
      ],
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

    // Create style loaders for regular styles
    const regularStyleExtensions = supportedStyleExtensions
    const regularStyleRegexp = new RegExp(
      `(${regularStyleExtensions.join('|')})$`,
    )
    const regularStyleLoaders = styleLoadersFactory({
      dir,
      dev,
      feature,
      modules: feature.modules || 'auto',
      names,
    })
    const regularStyleRule = ruleFactory(
      regularStyleRegexp,
      undefined,
      regularStyleLoaders,
    )

    config.module.rules.push(regularStyleRule)

    // Push ExtractCssChunks plugin for regular and modules styles
    config.plugins.push(
      new ExtractCssChunks({
        dev,
        filename: names.cssFilename(),
        chunkFilename: names.cssChunkFilename(),
      }),
    )
  }

  // Optimized images in production mode
  const optimizedImagesRule = ruleFactory(IMAGE_MINIFY_REGEXP)
  optimizedImagesRule.enforce = 'pre'
  optimizedImagesRule.use.push(
    ...([
      cache && {
        loader: resolveInApp('cache-loader'),
        options: {
          cacheDirectory: cacheDirectories.images,
          cacheContext: dir,
        },
      },
      {
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
      },
    ].filter(Boolean) as any[]),
  )
  config.module.rules.push(optimizedImagesRule)

  // Config `url-loader` and `file-loader` to use images files
  const imagesRule = ruleFactory(IMAGE_REGEXP)
  config.module.rules.push(imagesRule)

  const imagesLoader = {
    loader: resolveInApp('url-loader'),
    options: {
      limit: 5 * 1024,
      fallback: resolveInApp('file-loader'),
      context: dir,
      emitFile: true,
      outputPath: 'images',
      name: names.imageMinifiedFilename,
    },
  }
  imagesRule.use.push(imagesLoader)

  // Config loaders to use svg files as components and image files
  const svgRule = ruleFactory(SVG_REGEXP)
  svgRule.use.push(
    {
      loader: resolveInApp('@svgr/webpack'),
    },
    imagesLoader,
  )
  config.module.rules.push(svgRule)

  // Config `raw-loader` to use txt files
  const textRule = ruleFactory(TEXT_REGEXP)
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
      parse: {
        // we want terser to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        // Disabled because of an issue with Terser breaking valid code:
        // https://github.com/facebook/create-react-app/issues/5250
        // Pending futher investigation:
        // https://github.com/terser-js/terser/issues/120
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    }

    Object.assign(config.optimization, {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap,
          // @ts-ignore
          terserOptions,
          cache: cache ? cacheDirectories.terser : false,
          parallel: true,
        }),
      ],
    })
  } else {
    Object.assign(config.optimization, {
      minimize: false,
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
