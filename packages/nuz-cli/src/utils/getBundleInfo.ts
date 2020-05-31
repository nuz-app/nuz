import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import webpack from 'webpack'

export interface BundleInfoOutput {
  data: webpack.Stats.ToJsonOutput
  done: boolean
  errors: string[]
  warnings: string[]
}

const getBundleInfo = (stats: webpack.Stats): BundleInfoOutput => {
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
