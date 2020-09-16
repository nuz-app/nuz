import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import webpack from 'webpack'

import * as paths from '../../../paths'
import { FeaturesUsed, NamedConfiguration } from '../../../types'
import checkIsPackageUsed from '../../checkIsPackageUsed'
import getBrowserslist from '../../getBrowserslist'

export interface StyleLoadersOptions {
  directory: string
  dev: boolean
  sourceMap: boolean
  feature: Partial<FeaturesUsed>
  names: NamedConfiguration
  modules?: boolean | 'auto' | RegExp
}

function createStyleLoaders(options: StyleLoadersOptions): webpack.Loader[] {
  const {
    directory,
    dev,
    feature,
    names,
    modules = 'auto',
    sourceMap,
  } = options

  const resolveModule = (moduleId: string) =>
    paths.resolveNodeModules(moduleId, directory)
  const browserslist = getBrowserslist({ directory, dev })
  const loaders = [] as webpack.Loader[]

  // Set ExtractCssChunks loader for preprocessor
  loaders.push({
    loader: ExtractCssChunks.loader,
    options: {
      sourceMap,
      hmr: dev,
    },
  })

  // Set css loader
  loaders.push({
    loader: resolveModule('css-loader'),
    options: Object.assign(
      {
        sourceMap,
        importLoaders: feature.sass && feature.postcss ? 2 : 1,
        modules: !modules
          ? false
          : {
              context: directory,
              auto:
                modules === true
                  ? undefined
                  : modules === 'auto'
                  ? /(\.m(odule)?\.\w+)$/i
                  : modules,
              localIdentName: names.cssLocalIdentName(),
            },
      },
      feature.css,
    ),
  })

  // Set postcss loader
  const combinePostCssPlugins = (...rest) => {
    const { plugins: pluginsCustom = [] } = feature.postcss || {}

    const pluginsIsFn = typeof pluginsCustom === 'function'
    const plugins = pluginsIsFn ? pluginsCustom(...rest) : pluginsCustom

    return [
      require('postcss-preset-env')({
        browsers: browserslist || ['defaults'],
        autoprefixer: {
          grid: 'autoplace',
          flexbox: 'no-2009',
        },
      }),
      require('postcss-flexbugs-fixes')(),
      require('cssnano')({
        preset: 'default',
      }),
      ...(plugins || []),
    ]
  }
  loaders.push({
    loader: resolveModule('postcss-loader'),
    options: Object.assign(
      {
        ident: 'postcss',
        sourceMap,
      },
      feature.postcss === true ? {} : feature.postcss,
      {
        plugins: combinePostCssPlugins,
      },
    ),
  })

  if (feature.sass) {
    const nodeSassIsInstalled = checkIsPackageUsed('node-sass', directory)
    const dartSassIsInstalled = checkIsPackageUsed('dart-sass', directory)
    const sassIsInstalled = nodeSassIsInstalled || dartSassIsInstalled
    if (!sassIsInstalled) {
      throw new Error('Install `node-sass` or `dart-sass` to use Sass!')
    }

    // Set sass loader
    loaders.push({
      loader: resolveModule('sass-loader'),
      options: Object.assign(
        {
          sourceMap,
          implementation: dartSassIsInstalled
            ? require(paths.resolveNodeModules('dart-sass', directory))
            : require(paths.resolveNodeModules('node-sass', directory)),
        },
        feature.sass === true ? {} : feature.sass,
      ),
    })
  }

  if (feature.less) {
    const lessIsInstalled = checkIsPackageUsed('less', directory)
    if (!lessIsInstalled) {
      throw new Error('Install `less` to use Less!')
    }

    // Set less loader
    loaders.push({
      loader: resolveModule('less-loader'),
      options: Object.assign(
        { sourceMap },
        feature.less === true ? {} : feature.less,
      ),
    })
  }

  return loaders
}

export default createStyleLoaders
