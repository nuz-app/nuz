import { hashFile, integrityHelpers } from '@nuz/utils'
import path from 'path'
import webpack from 'webpack'

export interface PickOptions {
  useIntegrity?: boolean
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

const transformAssetFactory = (outputPath: string, publicPath: string) => (
  fileName: string | undefined,
) => {
  if (!fileName) {
    throw new Error(`Can not transform asset because file name is undefined`)
  }

  const filePath = path.join(outputPath, fileName)

  return {
    path: fileName,
    url: publicPath + fileName,
    md5sum: hashFile(filePath, 'md5'),
  }
}

const pickAssetsFromStats = (
  stats: webpack.Stats.ToJsonOutput,
  options: PickOptions = {},
): { resolve: PickOutput; files: PickResouce[] } => {
  const { outputPath, publicPath, assets: allAssets, entrypoints } = stats
  const { assets } = (entrypoints || {}).main

  if (!outputPath || !assets) {
    throw new Error('Not found outputPath or assets in stats')
  }

  const transformAsset = transformAssetFactory(outputPath, publicPath as string)
  const main = transformAsset(assets.find((item) => /\.js$/.test(item)))
  const styles = assets
    .filter((item) => /\.css$/.test(item))
    .map(transformAsset)
  const resolve = {
    main,
    styles,
  }

  const files = (allAssets || []).map((item) => transformAsset(item.name))

  return { resolve, files }
}

export default pickAssetsFromStats
