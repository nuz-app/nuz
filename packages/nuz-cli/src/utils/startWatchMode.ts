import clearConsole from './clearConsole'
import getBundleInfo from './getBundleInfo'
import { common } from './print'
import * as webpackCompiler from './webpackCompiler'

const startWatchMode = async (
  config: webpackCompiler.AllowWebpackConfig,
  onChange?: any,
) => {
  let isFirstBuild = false
  const watcher = await webpackCompiler.watch(config, (error, stats) => {
    if (!isFirstBuild) {
      clearConsole()
    } else {
      isFirstBuild = false
    }

    if (error) {
      common.buildFailed(error)
      return
    }

    const bundleInfo = getBundleInfo(stats)
    if (!bundleInfo.done) {
      common.showErrorsAndWarnings(bundleInfo)
      return
    }

    const buildTime = stats.endTime - stats.startTime
    common.waitingForChanges(buildTime)

    if (typeof onChange === 'function') {
      onChange(bundleInfo)
    }
  })

  return watcher
}

export default startWatchMode
