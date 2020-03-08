import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import webpack from 'webpack'

const getBundleInfo = (stats: webpack.Stats) => {
  const results = formatWebpackMessages(stats.toJson())
  const done = results.errors.length === 0

  return {
    ...results,
    done,
  }
}

export default getBundleInfo
