import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import webpack from 'webpack'

import { FeatureConfig } from '../../../types'

import checkIsPackageInstalled from '../../checkIsPackageInstalled'
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
    loader: paths.resolveInApp('css-loader'),
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
  loaders.push({
    loader: paths.resolveInApp('postcss-loader'),
    options: Object.assign(
      {
        ident: 'postcss',
        path: dir,
      },
      feature.postcss === true ? {} : feature.postcss,
      {
        plugins: () => [
          require('postcss-preset-env')(),
          require('autoprefixer')({
            grid: 'autoplace',
            flexbox: 'no-2009',
          }),
          ...((feature.postcss || {}).plugins || []),
        ],
      },
    ),
  })

  if (feature.sass) {
    const nodeSassIsInstalled = checkIsPackageInstalled('node-sass')
    const dartSassIsInstalled = checkIsPackageInstalled('dart-sass')
    const sassIsInstalled = nodeSassIsInstalled || dartSassIsInstalled
    if (!sassIsInstalled) {
      throw new Error('Install `node-sass` or `dart-sass` to use Sass!')
    }

    // Set sass loader
    loaders.push({
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
    loaders.push({
      loader: paths.resolveInApp('less-loader'),
      options: feature.less === true ? {} : feature.less,
    })
  }

  return loaders
}

export default styleLoadersFactory
