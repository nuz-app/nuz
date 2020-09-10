import { hashFile } from '@nuz/utils'
import path from 'path'
import webpack from 'webpack'

export interface PickOptions {
  md5sum?: boolean
}

export interface PickResouce {
  url: string
  path: string
  md5sum: string | undefined
}

export interface PickOutput {
  main: PickResouce
  styles: PickResouce[]
}

function getModuleAssetsOnly(
  stats: webpack.Stats | webpack.Stats.ToJsonOutput,
  options: PickOptions = {},
): { resolve: PickOutput; files: PickResouce[] } {
  const data = 'toJson' in stats ? stats.toJson() : stats

  const { outputPath, publicPath, entrypoints, assets: allAssets } = data

  if (!outputPath) {
    throw new Error('Missing `outoutPath` in the stats')
  }

  const entrypointsAssets = entrypoints?.main.assets
  if (!entrypointsAssets) {
    throw new Error('Missing entrypoints assets in the stats')
  }

  // Create a asset transform helper
  function transformer(
    file: string,
  ): {
    path: string
    url: string
    md5sum: string | undefined
  } {
    const { md5sum } = Object.assign({ md5sum: true }, options)

    return {
      path: file,
      url: publicPath + file,
      md5sum: md5sum
        ? hashFile(path.join(outputPath as string, file), 'md5')
        : undefined,
    }
  }

  const main = transformer(
    entrypointsAssets.find((item) => /\.js$/.test(item)) as string,
  )
  const styles = entrypointsAssets
    .filter((item) => /\.css$/.test(item))
    .map(transformer)

  const files = (allAssets ?? []).map((item) => transformer(item.name))

  return {
    files,
    resolve: {
      main,
      styles,
    },
  }
}

export default getModuleAssetsOnly
