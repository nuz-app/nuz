import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import postcssNormalize from 'postcss-normalize'

import * as paths from '../../paths'
import { InternalConfiguration } from '../../types'

export interface CreateStyleLoadersConfig {
  directory: string
  internalConfig: InternalConfiguration
  sourceMap: boolean
}

function createStyleLoaders(config, cssOptions, preProcessor?: string) {
  const { directory, sourceMap, internalConfig } = config

  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: internalConfig.publicUrlOrPath.startsWith('.')
        ? { publicPath: '../' }
        : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap,
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                grid: 'autoplace',
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            postcssNormalize(),
          ],
        },
      },
    },
  ].filter(Boolean)

  //
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap,
          root: paths.resolveSourceDirectory(directory),
        },
      },
      {
        loader: paths.resolveNodeModules(preProcessor, directory),
        options: {
          sourceMap: true,
        },
      },
    )
  }

  return loaders
}

export default createStyleLoaders
