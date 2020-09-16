import { MODULE_ASSET_SIZE_LIMIT, MODULE_TOTAL_SIZE_LIMIT } from '@nuz/shared'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import os from 'os'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WebpackProcessBar from 'webpackbar'

import {
  CSS_EXTENSIONS,
  JSON_EXTENSIONS,
  JS_EXTENSIONS,
  LESS_EXTENSIONS,
  LOADER_FONT_REGEXP,
  LOADER_IMAGE_MINIFY_REGEXP,
  LOADER_IMAGE_REGEXP,
  LOADER_JAVASCRIPT_REGEXP,
  LOADER_SVG_REGEXP,
  LOADER_TEXT_REGEXP,
  LOADER_TYPESCRIPT_REGEXP,
  SASS_EXTENSIONS,
  STATS_FILENAME,
  TS_EXTENSIONS,
} from '../../../lib/const'
import * as paths from '../../../paths'
import {
  AnalyzerConfiguration,
  FeaturesUsed,
  InternalConfiguration,
} from '../../../types'
import checkIsPackageUsed from '../../checkIsPackageUsed'
import * as compilerName from '../../compilerName'
import generateModuleId from '../../generateModuleId'
import getSystemPaths from '../../getSystemPaths'
import createNamedConfiguration from '../helpers/createNamedConfiguration'
import createRule from '../helpers/createRule'
import setExternals from '../helpers/setExternals'
import PeerDepsExternalsPlugin from '../PeerDepsExternalsPlugin'

import styleLoadersFactory from './styleLoaders'

export interface FactoryConfiguration {
  ci?: boolean
  module?: string
  directory: string
  dev: boolean
  cache: boolean
  config: InternalConfiguration
}

export interface FactoryOptions {
  injectReact?: boolean
  showProcess?: boolean
}

export type WebpackConfiguration = NonNullable<
  Pick<
    webpack.Configuration,
    | 'entry'
    | 'bail'
    | 'mode'
    | 'target'
    | 'devtool'
    | 'cache'
    | 'context'
    | 'entry'
    | 'output'
    | 'resolve'
    | 'externals'
    | 'plugins'
    | 'optimization'
    | 'performance'
  >
>

function createWebpackConfig(
  _config: FactoryConfiguration,
  featuresUsed: Partial<FeaturesUsed> = {},
  options: FactoryOptions = {},
): WebpackConfiguration {
  const {
    dev,
    directory,
    cache,
    ci,
    module,
    config: moduleConfiguration,
  } = Object.assign({ module: '~', ci: false, cache: true }, _config)

  //
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
  } = Object.assign(
    {
      isolated: false,
      publicPath: '/',
      format: 'umd' as webpack.LibraryTarget,
      experimental: {},
      externals: {},
      alias: {},
    },
    moduleConfiguration,
  )

  //
  const { showProcess, injectReact } = Object.assign(
    {
      showProcess: true,
      injectReact: false,
    },
    options,
  )

  //
  const experimental = Object.assign(
    {
      multiThread: false,
    },
    experimentalCustomer,
  )
  const id = generateModuleId(module)
  const names = Object.assign(
    createNamedConfiguration({ id, dev }),
    namesCustomer,
  )

  const target = 'web'
  const mode = dev ? 'development' : 'production'
  const sourceMap = true
  const bail = !dev
  const inputs = getSystemPaths(directory, input)
  const outputs = getSystemPaths(directory, output)
  const distChunkFilename = names.chunkFilename()
  const umdNamedDefine = format === 'umd'
  const scriptType = 'text/javascript'
  const loadTimeout = 120000
  const globalObject = `(typeof self !== 'undefined' ? self : this)`
  const mainFields = ['browser', 'module', 'main']
  const requireModules = ['node_modules']
  const statsFilename = STATS_FILENAME
  const name = compilerName.get(module)

  const extensions = featuresUsed.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  const cacheDirectories = {
    bundles: (paths as any).resolveLocalCache('bundles'),
    babel: (paths as any).resolveLocalCache('babel'),
    terser: (paths as any).resolveLocalCache('terser'),
    images: (paths as any).resolveLocalCache('images'),
  }
  const cacheConfig = cache
    ? {
        type: 'filesystem',
        cacheDirectory: cacheDirectories.bundles,
        hashAlgorithm: 'md4',
      }
    : false

  function resolveModule(moduleId: string) {
    return paths.resolveNodeModules(moduleId, directory)
  }

  const config = {
    name,
    bail,
    mode,
    target,
    devtool: false,
    cache: cacheConfig,
    context: directory,
    entry: inputs.path,
    output: {
      // Ref https://github.com/webpack/webpack/issues/959#issuecomment-546506221
      library: library || '[name]',
      umdNamedDefine,
      globalObject,
      publicPath,
      path: outputs.directory,
      filename: outputs.filename,
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
    // https://github.com/webpack/webpack/issues/3216
    performance: !dev && {
      maxEntrypointSize: MODULE_TOTAL_SIZE_LIMIT,
      maxAssetSize: MODULE_ASSET_SIZE_LIMIT,
      hints: 'warning',
      assetFilter(assetFilename) {
        return !/\.map$/.test(assetFilename)
      },
    },
  }

  if (showProcess) {
    // Push process bar handler to plugins
    config.plugins.push(
      new WebpackProcessBar({
        name,
        color: 'green',
      }),
    )
  }

  // Push source maps builder to plugins
  const sourceMapsPlugins = [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath,
    }),
  ]
  config.plugins.push(...sourceMapsPlugins)

  if (!injectReact && featuresUsed.react) {
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

  const useNext = checkIsPackageUsed('next', directory)
  if (useNext) {
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
  const scriptRule = createRule(
    featuresUsed.typescript
      ? LOADER_TYPESCRIPT_REGEXP
      : LOADER_JAVASCRIPT_REGEXP,
    /node_modules/,
  )

  if (experimental.multiThread) {
    // Set thread loader to use child process
    scriptRule.use.push({
      loader: resolveModule('thread-loader'),
      options: {
        workers: Math.max(1, os.cpus().length - 1),
        poolTimeout: !dev ? 2000 : Infinity,
      },
    })
  }

  // Set babel loader to transplie es
  scriptRule.use.push({
    loader: resolveModule('babel-loader'),
    options: {
      cacheDirectory: cache ? cacheDirectories.babel : false,
      presets: [
        [
          resolveModule('@babel/preset-env'),
          {
            // Allow importing core-js in entrypoint and use browserlist to select polyfills
            useBuiltIns: 'entry',
            // Set the corejs version we are using to avoid warnings in console
            corejs: 3,
            // Do not transform modules to CJS
            modules: false,
            // Exclude transforms that make all code slower
            exclude: ['transform-typeof-symbol'],
          },
        ],
        featuresUsed.react && [
          resolveModule('@babel/preset-react'),
          {
            // Adds component stack to warning messages
            // Adds __self attribute to JSX which React will use for some warnings
            development: dev,
            // Will use the native built-in instead of trying to polyfill
            // behavior for any plugins that require one.
            useBuiltIns: true,
          },
        ],
      ].filter(Boolean) as any[],
      plugins: [
        // Enable loose mode to use assignment instead of defineProperty
        // See discussion in https://github.com/facebook/create-react-app/issues/4263
        [
          resolveModule('@babel/plugin-proposal-class-properties'),
          {
            loose: true,
          },
        ],

        // Adds Numeric Separators
        [resolveModule('@babel/plugin-proposal-numeric-separator')],

        // Polyfills the runtime needed for async/await, generators, and friends
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime
        [
          resolveModule('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: true,
            // By default, babel assumes babel/runtime version 7.0.0-beta.0,
            // explicitly resolving to match the provided helper functions.
            // https://github.com/babel/babel/issues/10261
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
            // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
            // We should turn this on once the lowest version of Node LTS
            // supports ES Modules.
            useESModules: true,
            // Undocumented option that lets us encapsulate our runtime, ensuring
            // the correct version is used
            // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
            absoluteRuntime: path.dirname(
              resolveModule('@babel/runtime/package.json'),
            ),
          },
        ],

        // Optional chaining and nullish coalescing are supported in @babel/preset-env,
        // but not yet supported in webpack due to support missing from acorn.
        // These can be removed once webpack has support.
        // See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
        [resolveModule('@babel/plugin-proposal-optional-chaining')],
        [resolveModule('@babel/plugin-proposal-nullish-coalescing-operator')],
        // Transform React display name, use function name as display name
        // [require.resolve('@babel/plugin-transform-react-display-name')],
        // This plugin transforms ECMAScript modules to CommonJS.
        [resolveModule('@babel/plugin-transform-modules-commonjs')],
        [resolveModule('babel-plugin-dynamic-import-node')],
      ],
    },
  })

  // Set typescript loader to transplie ts
  if (featuresUsed.typescript) {
    const typescriptIsInstalled = checkIsPackageUsed('typescript', directory)
    if (!typescriptIsInstalled) {
      throw new Error(
        `Typescript cannot be found, please install \`typescript\` it to use.`,
      )
    }

    const tsconfigPath = path.join(directory, 'tsconfig.json')

    scriptRule.use.push({
      loader: resolveModule('ts-loader'),
      options: {
        configFile: tsconfigPath,
        context: directory,
        colors: !ci,
        compilerOptions: { sourceMap },
        happyPackMode: true,
        transpileOnly: true,
      },
    })

    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: tsconfigPath,
        silent: false,
        async: false,
        // useTypescriptIncrementalApi: false,
      }),
    )
    config.plugins.push(new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]))
  }

  // Push scripts rule to config
  config.module.rules.push(scriptRule)

  const shouldUseIncludeStyles = [
    featuresUsed.css,
    featuresUsed.postcss,
    featuresUsed.less,
    featuresUsed.sass,
  ].some(Boolean)
  if (shouldUseIncludeStyles) {
    const supportedStyleExtensions = ([] as any[])
      .concat(
        featuresUsed.css && CSS_EXTENSIONS,
        featuresUsed.sass && SASS_EXTENSIONS,
        featuresUsed.less && LESS_EXTENSIONS,
      )
      .filter(Boolean)

    // Create style loaders for regular styles
    const regularStyleExtensions = supportedStyleExtensions
    const regularStyleRegexp = new RegExp(
      `(${regularStyleExtensions.join('|')})$`,
    )
    const regularStyleLoaders = styleLoadersFactory({
      directory,
      dev,
      sourceMap,
      feature: featuresUsed,
      modules: featuresUsed.modules || 'auto',
      names,
    })
    const regularStyleRule = createRule(
      regularStyleRegexp,
      undefined,
      regularStyleLoaders,
    )
    // Push styles rule to config
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
  const optimizedImagesRule = createRule(LOADER_IMAGE_MINIFY_REGEXP)
  optimizedImagesRule.enforce = 'pre'
  optimizedImagesRule.use.push(
    ...([
      cache && {
        loader: resolveModule('cache-loader'),
        options: {
          cacheDirectory: cacheDirectories.images,
          cacheContext: directory,
        },
      },
      {
        loader: resolveModule('image-webpack-loader'),
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
  // Push image optimal rule to config
  config.module.rules.push(optimizedImagesRule)

  // Config `url-loader` and `file-loader` to use images files
  const imagesRule = createRule(LOADER_IMAGE_REGEXP)
  const imagesLoader = {
    loader: resolveModule('url-loader'),
    options: {
      limit: 5 * 1024,
      fallback: resolveModule('file-loader'),
      context: directory,
      emitFile: true,
      outputPath: 'images',
      name: names.imageMinifiedFilename,
    },
  }
  imagesRule.use.push(imagesLoader)
  // Push regular image rule to config
  config.module.rules.push(imagesRule)

  // Config loaders to use svg files as components and image files
  const svgRule = createRule(LOADER_SVG_REGEXP)
  svgRule.use.push(
    {
      loader: resolveModule('@svgr/webpack'),
    },
    imagesLoader,
  )
  // Push svg rule to config
  config.module.rules.push(svgRule)

  // Config `raw-loader` to use txt files
  const textRule = createRule(LOADER_TEXT_REGEXP)
  textRule.use.push({
    loader: resolveModule('raw-loader'),
  })
  // Push text rule to config
  config.module.rules.push(textRule)

  // Config `file-loader` to use font files
  const fontRule = createRule(LOADER_FONT_REGEXP)
  fontRule.use.push({
    loader: resolveModule('file-loader'),
  })
  // Push font rule to config
  config.module.rules.push(fontRule)

  // Set peers deps as externals
  config.plugins.push(
    new PeerDepsExternalsPlugin(
      directory,
      isolated,
      !injectReact ? [] : ['react', 'react-dom'],
    ),
  )

  // Config optimization for production mode
  if (!dev) {
    // Push bundle analyzer for production mde
    const analyzerConfig = (analyzer || {}) as AnalyzerConfiguration
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
    const customConfig = webpackCustomer(config as WebpackConfiguration)

    if (!customConfig.output) {
      throw new Error('Webpack configuration returned incorrectly.')
    }

    return customConfig
  }

  return config as WebpackConfiguration
}

export default createWebpackConfig
