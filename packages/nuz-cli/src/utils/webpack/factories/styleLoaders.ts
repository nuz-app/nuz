import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import webpack from 'webpack'

import { FeatureConfig } from '../../../types'

import checkIsPackageInstalled from '../../checkIsPackageInstalled'
import getBrowserslist from '../../getBrowserslist'
import * as paths from '../../paths'

export interface StyleLoadersOptions {
  dir: string
  dev: boolean
  modules: boolean
  feature: Partial<FeatureConfig>
}

const styleLoadersFactory = ({
  dir,
  dev,
  feature,
  modules,
}: StyleLoadersOptions): webpack.Loader[] => {
  const resolveInApp = (moduleId: string) => paths.resolveInApp(moduleId, dir)
  const browserslist = getBrowserslist({ dir, dev })

  const loaders = [] as webpack.Loader[]

  // Set ExtractCssChunks loader for preprocessor
  loaders.push({
    loader: ExtractCssChunks.loader,
    options: {
      hmr: dev,
    },
  })

  // Set css loader
  loaders.push({
    loader: resolveInApp('css-loader'),
    options: Object.assign(
      {
        modules: modules
          ? {
              mode: 'local',
              localIdentName: dev
                ? '[name]_[local]-[contenthash:4]'
                : '[contenthash:8]',
            }
          : false,
        importLoaders: 1,
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
    loader: resolveInApp('postcss-loader'),
    options: Object.assign(
      {
        ident: 'postcss',
      },
      feature.postcss === true ? {} : feature.postcss,
      {
        plugins: combinePostCssPlugins,
      },
    ),
  })

  if (feature.sass) {
    const nodeSassIsInstalled = checkIsPackageInstalled('node-sass', dir)
    const dartSassIsInstalled = checkIsPackageInstalled('dart-sass', dir)
    const sassIsInstalled = nodeSassIsInstalled || dartSassIsInstalled
    if (!sassIsInstalled) {
      throw new Error('Install `node-sass` or `dart-sass` to use Sass!')
    }

    // Set sass loader
    loaders.push({
      loader: resolveInApp('sass-loader'),
      options: Object.assign(
        {
          implementation: dartSassIsInstalled
            ? require(dartSassIsInstalled)
            : require(nodeSassIsInstalled as string),
        },
        feature.sass === true ? {} : feature.sass,
      ),
    })
  }

  if (feature.less) {
    const lessIsInstalled = checkIsPackageInstalled('less', dir)
    if (!lessIsInstalled) {
      throw new Error('Install `less` to use Less!')
    }

    // Set less loader
    loaders.push({
      loader: resolveInApp('less-loader'),
      options: feature.less === true ? {} : feature.less,
    })
  }

  return loaders
}

export default styleLoadersFactory
