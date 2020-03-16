import { integrityHelpers } from '@nuz/utils'
import path from 'path'
import webpack from 'webpack'

export interface PickOptions {
  useIntegrity?: boolean
}

export interface PickOutput {
  main: {
    url: string
    integrity: string
  }
  styles: {
    url: string
    integrity: string
  }[]
}

const pickAssetsFromStats = (
  stats: webpack.Stats.ToJsonOutput,
  options: PickOptions = {},
): PickOutput => {
  const { outputPath, publicPath, entrypoints } = stats
  const { assets } = entrypoints.main

  const transformAsset = (filename: string) => ({
    url: publicPath + filename,
    integrity: !options.useIntegrity
      ? undefined
      : integrityHelpers.file(path.join(outputPath, filename)),
  })

  const main = transformAsset(assets.find(item => /\.js$/.test(item)))
  const styles = assets.filter(item => /\.css$/.test(item)).map(transformAsset)
  const resolve = {
    main,
    styles,
  }

  return resolve
}

export default pickAssetsFromStats
