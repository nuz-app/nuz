import webpack from 'webpack'
import formatMessages from 'webpack-format-messages'

export interface BundleInfoOutput {
  data: webpack.Stats.ToJsonOutput
  done: boolean
  errors: string[]
  warnings: string[]
}

const getBundleInfo = (stats: webpack.Stats): BundleInfoOutput => {
  const results = formatMessages(stats)
  const data = stats.toJson()
  const done = results.errors.length === 0

  return {
    ...results,
    done,
    data,
  }
}

export default getBundleInfo
