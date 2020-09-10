import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import webpack from 'webpack'

export interface BuildOutputInformation {
  data: webpack.Stats.ToJsonOutput
  done: boolean
  errors: string[]
  warnings: string[]
}

function getBuildOutputInformation(
  stats: webpack.Stats | webpack.Stats.ToJsonOutput,
): BuildOutputInformation {
  const data = 'toJson' in stats ? stats.toJson() : stats
  const results = formatWebpackMessages(data)
  const done = results.errors.length === 0

  return {
    ...results,
    done,
    data,
  }
}

export default getBuildOutputInformation
