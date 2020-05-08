import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'

function pickFilesFromStats(
  stats: webpack.Stats.ToJsonOutput,
): fs.ReadStream[] {
  const { outputPath, entrypoints } = stats
  const { assets } = (entrypoints || {}).main

  const files = assets.map((filename) =>
    fs.createReadStream(path.join(outputPath as string, filename)),
  )
  return files
}

export default pickFilesFromStats
