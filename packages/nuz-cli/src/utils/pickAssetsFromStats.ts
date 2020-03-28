import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import webpack from 'webpack'

export interface PickOptions {
  useIntegrity?: boolean
}

export interface PickOutput {
  main: {
    url: string
    integrity: string | undefined
  }
  styles: {
    url: string
    integrity: string | undefined
  }[]
}

const pickAssetsFromStats = (
  stats: webpack.Stats.ToJsonOutput,
  options: PickOptions = {},
): PickOutput => {
  const { outputPath, publicPath, entrypoints } = stats
  const { assets } = (entrypoints || {}).main

  if (!outputPath || !assets) {
    throw new Error('Not found outputPath or assets in stats')
  }

  const transformAsset = (filename: string | undefined) => {
    if (!filename) {
      throw new Error(`Can not transform asset because filename is undefined`)
    }

    return {
      url: publicPath + filename,
      integrity: !options.useIntegrity
        ? undefined
        : integrityHelpers.file(path.join(outputPath, filename)),
    }
  }

  const main = transformAsset(assets.find((item) => /\.js$/.test(item)))
  const styles = assets
    .filter((item) => /\.css$/.test(item))
    .map(transformAsset)
  const resolve = {
    main,
    styles,
  }

  return resolve
}

export default pickAssetsFromStats
