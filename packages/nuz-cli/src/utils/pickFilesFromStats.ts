import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'

function pickFilesFromStats(
  stats: webpack.Stats.ToJsonOutput,
): fs.ReadStream[] {
  const { outputPath, assets } = stats

  const files = (assets || []).map((asset) =>
    fs.createReadStream(path.join(outputPath as string, asset.name)),
  )
  return files
}

export default pickFilesFromStats
