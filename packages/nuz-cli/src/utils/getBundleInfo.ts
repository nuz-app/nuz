import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import webpack from 'webpack'

const getBundleInfo = (stats: webpack.Stats) => {
  const data = stats.toJson()
  const results = formatWebpackMessages(data)
  const done = results.errors.length === 0

  return {
    ...results,
    done,
    data,
  }
}

export default getBundleInfo
