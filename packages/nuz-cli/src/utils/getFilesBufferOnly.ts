import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'

function getFilesBufferOnly(
  stats: webpack.Stats | webpack.Stats.ToJsonOutput,
): fs.ReadStream[] {
  const data = 'toJson' in stats ? stats.toJson() : stats

  const { outputPath, assets } = data
  const files = (assets || []).map((asset) =>
    fs.createReadStream(path.join(outputPath as string, asset.name)),
  )

  return files
}

export default getFilesBufferOnly
