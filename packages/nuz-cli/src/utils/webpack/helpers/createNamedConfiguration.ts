import path from 'path'

import { LOADER_IMAGE_MINIFY_REGEXP } from '../../../lib/const'
import { NamedConfiguration } from '../../../types'

interface CreateNamedConfigurationOptions {
  id: string
  dev: boolean
}

function createNamedConfiguration(
  options: CreateNamedConfigurationOptions,
): NamedConfiguration {
  const { id, dev } = options

  return {
    imageMinifiedFilename: (resourcePath: string) => {
      const isMinify = LOADER_IMAGE_MINIFY_REGEXP.test(resourcePath)
      if (isMinify) {
        const filename = path
          .basename(resourcePath)
          .replace(LOADER_IMAGE_MINIFY_REGEXP, '')

        return dev
          ? `${filename}.[contenthash:8].min.[ext]`
          : `${filename}.[contenthash].min.[ext]`
      }

      return dev ? `[name].[contenthash:8].[ext]` : `[name].[contenthash].[ext]`
    },
    chunkFilename: () => '[name]-[contenthash].js',
    cssLocalIdentName: () =>
      dev ? `${id}-[name]-[local]-[hash:base64:6]` : `${id}-[contenthash:5]`,
    cssFilename: () =>
      dev ? 'styles/[name].css' : 'styles/[name].[contenthash:8].css',
    cssChunkFilename: () =>
      dev
        ? 'styles/[name].chunk.css'
        : 'styles/[name].[contenthash:8].chunk.css',
  }
}

export default createNamedConfiguration
