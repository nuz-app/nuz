import {
  MODULE_ASSET_SIZE_LIMIT,
  MODULE_TOTAL_SIZE_LIMIT,
  ModuleFormats,
} from '@nuz/shared'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import PnpWebpackPlugin from 'pnp-webpack-plugin'
import safePostCssParser from 'postcss-safe-parser'
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier'
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent'
import typescriptFormatter from 'react-dev-utils/typescriptFormatter'
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin'
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import semver from 'semver'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ManifestPlugin from 'webpack-manifest-plugin'
import WebpackProcessBar from 'webpackbar'

import {
  JSON_EXTENSIONS,
  JS_EXTENSIONS,
  MANIFEST_FILENAME,
  STATS_FILENAME,
  TS_EXTENSIONS,
} from '../../lib/const'
import * as paths from '../../paths'
import { FeaturesUsed } from '../../types'
import checkIsCI from '../checkIsCI'
import checkIsPackageUsed from '../checkIsPackageUsed'
import getSystemPaths from '../getSystemPaths'
import readPackageJson from '../readPackageJson'
import requireEnvironment from '../requireEnvironment'
import { ParsedInternalConfig } from '../requireInternalConfig'

import createStyleLoaders from './createStyleLoaders'
import setExternals from './setExternals'
import PeerDepsExternalsPlugin from './PeerDepsExternalsPlugin'

export interface FactoryConfiguration {
  ci?: boolean
  directory: string
  dev: boolean
  cache: boolean
  internalConfig: ParsedInternalConfig
}

export interface FactoryOptions {
  injectReact?: boolean
  showProcess?: boolean
}

export interface WebpackConfiguration
  extends webpack.Configuration,
    NonNullable<
      Pick<
        webpack.Configuration,
        | 'name'
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
        | 'resolveLoader'
      >
    > {}

function createWebpackConfig(
  config: FactoryConfiguration,
  featuresUsed: Partial<FeaturesUsed> = {},
  options?: FactoryOptions,
): WebpackConfiguration {
  const { dev, directory, internalConfig } = Object.assign(
    { ci: checkIsCI(), cache: true },
    config,
  )

  const { showProcess, injectReact } = Object.assign(
    { showProcess: true, injectReact: false },
    options,
  )

  const react = require(require.resolve('react', {
    paths: [directory],
  }))
  const sourceMap = true
  const isProfiling = false // !dev && '--profile'
  const format = ModuleFormats.umd
  const environment = requireEnvironment(dev)
  const packageJson = readPackageJson(directory)
  const resolveInput = getSystemPaths(directory, internalConfig.input)
  const resolveOutpuut = getSystemPaths(directory, internalConfig.output)
  const moduleFileExtensions = featuresUsed.typescript
    ? [...TS_EXTENSIONS, ...JS_EXTENSIONS, ...JSON_EXTENSIONS]
    : [...JS_EXTENSIONS, ...JSON_EXTENSIONS]

  // Create cache directories
  const cacheDirectories = {
    eslint: (paths as any).resolveLocalCache('eslint'),
    babel: (paths as any).resolveLocalCache('babel'),
    terser: (paths as any).resolveLocalCache('terser'),
    images: (paths as any).resolveLocalCache('images'),
  }

  // Style and other files regexes
  const cssRegex = /\.css$/
  const cssModuleRegex = /\.module\.css$/
  const sassRegex = /\.(scss|sass)$/
  const sassModuleRegex = /\.module\.(scss|sass)$/

  return {
    //
    name: packageJson.name,
    //
    mode: !dev ? 'production' : 'development',
    // Stop compilation early in production.
    bail: !dev,
    // Use the plugin to be able to customize the correct source map url.
    devtool: false,
    // Set context for the build configuration..
    context: directory,
    // Configure the entry to build.
    entry: [resolveInput.path],
    // Configure output information.
    output: {
      // The build folder.
      // path: !dev ? resolveOutpuut.directory : undefined,
      path: resolveOutpuut.directory,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: dev,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'index.js',
      // filename: !dev ? '[name].[contenthash:8].js' : 'bundle.js',
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: !dev
        ? '[name].[contenthash:8].chunk.js'
        : '[name].chunk.js',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: internalConfig.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows).
      devtoolModuleFilenameTemplate: function devtoolTemplate(
        info: webpack.DevtoolModuleFilenameTemplateInfo,
      ) {
        if (dev) {
          return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        }

        return path
          .relative(
            paths.resolveSourceDirectory(directory),
            info.absoluteResourcePath,
          )
          .replace(/\\/g, '/')
      },
      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp-${packageJson.name}`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
      // Ref https://github.com/webpack/webpack/issues/959#issuecomment-546506221
      library: internalConfig.library || '[name]',
      // Configure the format of the module.
      umdNamedDefine: format === 'umd',
      libraryTarget: format,
    },
    optimization: {
      minimize: !dev,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          cache: cacheDirectories.terser,
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
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
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isProfiling,
            keep_fnames: isProfiling,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          sourceMap,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: sourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      // Configure to merge all chunks into bundle.
      namedModules: true,
      usedExports: true,
      splitChunks: false,
      runtimeChunk: false,
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: [
        'node_modules',
        paths.resolveNodeModulesDirectory(directory),
      ].concat(internalConfig.additionalNodeModules || []),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: moduleFileExtensions,
      alias: Object.assign(
        {
          // Support React Native Web
          // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
          'react-native': 'react-native-web',
        },
        // Allows for better profiling with ReactDevTools
        isProfiling && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        },
        internalConfig.webpackAliases,
      ),
      plugins: [
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        PnpWebpackPlugin,
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.resolveSourceDirectory(directory), [
          paths.resolvePackageJson(directory),
        ]),
      ],
    },
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
        // from the current package.
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: 'pre',
          include: paths.resolveSourceDirectory(directory),
          use: [
            {
              options: {
                cache: cacheDirectories.eslint,
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
                resolvePluginsRelativeTo: __dirname,
                // baseConfig: {
                //   extends: [require.resolve('eslint-config-react-app/base')],
                // },
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
        },
        // Adds support for minify images,
        // using the extension .min.(png|jpe?g|gif|svg).
        {
          test: /\.min\.(png|jpe?g|gif|svg|bmp)$/i,
          enforce: 'pre',
          include: paths.resolveSourceDirectory(directory),
          use: [
            {
              loader: require.resolve('cache-loader'),
              options: {
                cacheDirectory: cacheDirectories.images,
                cacheContext: directory,
              },
            },
            {
              loader: require.resolve('image-webpack-loader'),
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
          ],
        },

        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: /\.(png|jpe?g|gif|bmp)$/i,
              loader: require.resolve('url-loader'),
              options: {
                limit: environment.inlineSizeLimit,
                fallback: require.resolve('file-loader'),
                context: directory,
                emitFile: true,
                name: 'images/[name].[hash:8].[ext]',
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.resolveSourceDirectory(directory),
              loader: require.resolve('babel-loader'),
              options: {
                // customize: require.resolve('./webpackOverrides'),
                babelrc: false,
                configFile: false,
                presets: [
                  [
                    // Latest stable ECMAScript features
                    require.resolve('@babel/preset-env'),
                    {
                      // Allow importing core-js in entrypoint and use browserlist to select polyfills
                      useBuiltIns: 'entry',
                      // Set the corejs version we are using to avoid warnings in console
                      corejs: 3,
                      // Exclude transforms that make all code slower
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                  featuresUsed.react && [
                    require.resolve('@babel/preset-react'),
                    {
                      // Adds component stack to warning messages
                      // Adds __self attribute to JSX which React will use for some warnings
                      development: dev,
                      // Will use the native built-in instead of trying to polyfill
                      // behavior for any plugins that require one.
                      useBuiltIns: true,
                      runtime: semver.gte(react.version, '17.0.0-alpha.0')
                        ? 'automatic'
                        : 'classic',
                    },
                  ],
                  featuresUsed.typescript && [
                    require.resolve('@babel/preset-typescript'),
                  ],
                ].filter(Boolean),
                // Make sure we have a unique cache identifier, erring on the
                // side of caution.
                // We remove this when the user ejects because the default
                // is sane and uses Babel options. Instead of options, we use
                // the @nuz/cli and babel-preset-react-app versions.
                cacheIdentifier: getCacheIdentifier(
                  !dev ? 'production' : 'development',
                  [
                    'babel-plugin-named-asset-import',
                    'babel-preset-react-app',
                    'react-dev-utils',
                    '@nuz/cli',
                  ],
                ),
                // @remove-on-eject-end
                plugins: [
                  // Experimental macros support. Will be documented after it's had some time
                  // in the wild.
                  [require.resolve('babel-plugin-macros')],
                  // Turn on legacy decorators for TypeScript files
                  featuresUsed.typescript && [
                    require.resolve('@babel/plugin-proposal-decorators'),
                    false,
                  ],
                  // class { handleClick = () => { } }
                  // Enable loose mode to use assignment instead of defineProperty
                  // See discussion in https://github.com/facebook/create-react-app/issues/4263
                  [
                    require.resolve('@babel/plugin-proposal-class-properties'),
                    {
                      loose: true,
                    },
                  ],
                  // Adds Numeric Separators
                  [require.resolve('@babel/plugin-proposal-numeric-separator')],
                  // Polyfills the runtime needed for async/await, generators, and friends
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
                  [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                      corejs: false,
                      helpers: true,
                      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                      // explicitly resolving to match the provided helper functions.
                      // https://github.com/babel/babel/issues/10261
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
                        require.resolve('@babel/runtime/package.json'),
                      ),
                    },
                  ],
                  !dev && [
                    // Remove PropTypes from production build
                    require.resolve(
                      'babel-plugin-transform-react-remove-prop-types',
                    ),
                    {
                      removeImport: true,
                    },
                  ],
                  // Optional chaining and nullish coalescing are supported in @babel/preset-env,
                  // but not yet supported in webpack due to support missing from acorn.
                  // These can be removed once webpack has support.
                  // See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
                  [require.resolve('@babel/plugin-proposal-optional-chaining')],
                  [
                    require.resolve(
                      '@babel/plugin-proposal-nullish-coalescing-operator',
                    ),
                  ],
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  // Transform React display name, use function name as display name
                  // [require.resolve('@babel/plugin-transform-react-display-name')],
                  // This plugin transforms ECMAScript modules to CommonJS.
                  [require.resolve('@babel/plugin-transform-modules-commonjs')],
                  [require.resolve('babel-plugin-dynamic-import-node')],
                ].filter(Boolean),
                overrides: [
                  featuresUsed.typescript && {
                    test: /\.tsx?$/,
                    plugins: [
                      [
                        require('@babel/plugin-proposal-decorators').default,
                        { legacy: true },
                      ],
                    ],
                  },
                ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: cacheDirectories.babel,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: !dev,
              },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                // Babel assumes ES Modules, which isn't safe until CommonJS
                // dies. This changes the behavior to assume CommonJS unless
                // an `import` or `export` is present in the file.
                // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
                sourceType: 'unambiguous',
                presets: [
                  [
                    // Latest stable ECMAScript features
                    require.resolve('@babel/preset-env'),
                    {
                      // Allow importing core-js in entrypoint and use browserlist to select polyfills
                      useBuiltIns: 'entry',
                      // Set the corejs version we are using to avoid warnings in console
                      // This will need to change once we upgrade to corejs@3
                      corejs: 3,
                      // Exclude transforms that make all code slower
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                ],
                plugins: [
                  // Disabled as it's handled automatically by preset-env, and `selectiveLoose` isn't
                  // yet merged into babel: https://github.com/babel/babel/pull/9486
                  // Related: https://github.com/facebook/create-react-app/pull/8215
                  // [
                  //   require('@babel/plugin-transform-destructuring').default,
                  //   {
                  //     // Use loose mode for performance:
                  //     // https://github.com/facebook/create-react-app/issues/5602
                  //     loose: false,
                  //     selectiveLoose: [
                  //       'useState',
                  //       'useEffect',
                  //       'useContext',
                  //       'useReducer',
                  //       'useCallback',
                  //       'useMemo',
                  //       'useRef',
                  //       'useImperativeHandle',
                  //       'useLayoutEffect',
                  //       'useDebugValue',
                  //     ],
                  //   },
                  // ],
                  // Polyfills the runtime needed for async/await, generators, and friends
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
                  [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                      corejs: false,
                      helpers: false,
                      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                      // explicitly resolving to match the provided helper functions.
                      // https://github.com/babel/babel/issues/10261
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
                        require.resolve('@babel/runtime/package.json'),
                      ),
                    },
                  ],
                ],
                cacheDirectory: cacheDirectories.babel,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                cacheIdentifier: getCacheIdentifier(
                  !dev ? 'production' : 'development',
                  [
                    'babel-plugin-named-asset-import',
                    'babel-preset-react-app',
                    'react-dev-utils',
                    '@nuz/cli',
                  ],
                ),
                // @remove-on-eject-end
                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: sourceMap,
                inputSourceMap: sourceMap,
              },
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: createStyleLoaders(
                { directory, sourceMap, internalConfig },
                {
                  importLoaders: 1,
                  sourceMap,
                },
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: createStyleLoaders(
                { directory, sourceMap, internalConfig },
                {
                  importLoaders: 1,
                  sourceMap,
                  modules: !dev
                    ? {
                        localIdentName: '[hash:base64:6]',
                      }
                    : {
                        getLocalIdent: getCSSModuleLocalIdent,
                      },
                },
              ),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: createStyleLoaders(
                { directory, sourceMap, internalConfig },
                {
                  importLoaders: 3,
                  sourceMap,
                },
                'sass-loader',
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: createStyleLoaders(
                { directory, sourceMap, internalConfig },
                {
                  importLoaders: 3,
                  sourceMap,
                  modules: !dev
                    ? {
                        localIdentName: '[hash:base64:6]',
                      }
                    : {
                        getLocalIdent: getCSSModuleLocalIdent,
                      },
                },
                'sass-loader',
              ),
            },
            // Adds support for image components
            {
              test: /\.svg$/i,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                },
                {
                  loader: require.resolve('url-loader'),
                  options: {
                    limit: environment.inlineSizeLimit,
                    fallback: require.resolve('file-loader'),
                    context: directory,
                    emitFile: true,
                    name: 'images/[name].[hash:8].[ext]',
                  },
                },
              ],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: require.resolve('file-loader'),
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'media/[name].[hash:8].[ext]',
              },
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },
    plugins: [
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(directory),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(environment.raw),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      dev && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      dev &&
        new WatchMissingNodeModulesPlugin(
          paths.resolveNodeModulesDirectory(directory),
        ),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'styles.css',
        chunkFilename: 'styles.chunk.css',
      }),
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new ManifestPlugin({
        fileName: MANIFEST_FILENAME,
        publicPath: internalConfig.publicUrlOrPath,
        generate(seed, files, entrypoints) {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path
            return manifest
          }, seed)
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith('.map'),
          )

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          }
        },
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // TypeScript type checking
      featuresUsed.typescript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: paths.resolveNodeModules('typescript', directory),
          async: dev,
          checkSyntacticErrors: true,
          resolveModuleNameModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          resolveTypeReferenceDirectiveModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          tsconfig: paths.resolveTsConfigFile(directory),
          reportFiles: [
            // This one is specifically to match during CI tests,
            // as micromatch doesn't match
            // '../cra-template-typescript/template/src/App.tsx'
            // otherwise.
            '../**/src/**/*.{ts,tsx}',
            '**/src/**/*.{ts,tsx}',
            '!**/src/**/__tests__/**',
            '!**/src/**/?(*.)(spec|test).*',
            '!**/src/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          silent: true,
          // The formatter is invoked directly in WebpackDevServerUtils during development
          formatter: !dev ? typescriptFormatter : undefined,
        }),

      // Set `peerDependencies` to externals for webpack configuration.
      new PeerDepsExternalsPlugin(directory, internalConfig.isolated),

      !dev &&
        new BundleAnalyzerPlugin({
          statsFilename: STATS_FILENAME,
          generateStatsFile: true,
          openAnalyzer: false,
          analyzerMode: 'static',
          analyzerPort: 'auto',
          statsOptions: {
            hash: true,
            builtAt: true,
            entrypoints: true,
            assets: true,
          },
        }),

      showProcess &&
        new WebpackProcessBar({
          name: packageJson.name,
          color: 'green',
        }),

      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        publicPath: internalConfig.publicUrlOrPath,
      }),
    ].filter(Boolean),
    // Set externals for webpack configuration
    externals: ([] as any[])
      .concat(
        // Set externals for other packages.
        (internalConfig.shared || []).reduce(
          (acc, item) =>
            Object.assign(acc, {
              [item]: setExternals(item, internalConfig.isolated),
            }),
          {},
        ),
        // Set externals for React packages.
        !injectReact &&
          featuresUsed.react && {
            react: setExternals('react', internalConfig.isolated),
            'react-dom': setExternals('react-dom', internalConfig.isolated),
          },
        // Set externals for Next.js packages.
        checkIsPackageUsed('next', directory) &&
          [
            'next/dynamic',
            'next/router',
            'next/link',
            'next/head',
            'next/amp',
          ].reduce(
            (acc, item) =>
              Object.assign(acc, {
                [item]: setExternals(item, internalConfig.isolated),
              }),
            {},
          ),
      )
      .filter(Boolean),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      setImmediate: false,
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
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
}

export default createWebpackConfig
