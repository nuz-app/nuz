import clearConsole from './clearConsole'
import getBundleInfo, { BundleInfoOutput } from './getBundleInfo'
import { common } from './print'
import * as webpackCompiler from './webpackCompiler'

interface WatchModeOptions {
  clearConsole?: boolean
}

const runWatchMode = async (
  config: webpackCompiler.AllowWebpackConfig,
  options: WatchModeOptions = { clearConsole: true },
  onChange?: (
    bundleInfo: BundleInfoOutput,
    other: { isFirstBuild: boolean },
  ) => void,
) => {
  let isFirstBuild = true

  const watcher = await webpackCompiler.watch(config, (error, stats) => {
    const shouldClean = !isFirstBuild && options.clearConsole
    if (shouldClean) {
      clearConsole()
    }

    isFirstBuild = false

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
      onChange(bundleInfo, { isFirstBuild })
    }
  })

  return watcher
}

export default runWatchMode
