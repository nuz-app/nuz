import { CHANGES_EMOJI } from '../lib/const'

import clearConsole from './clearConsole'
import getBundleInfo, { BundleInfoOutput } from './getBundleInfo'
import print, { error, log, warn } from './print'
import * as webpackCompiler from './webpackCompiler'

function showErrorsAndWarnings({
  errors,
  warnings,
}: {
  errors: string[]
  warnings: string[]
}) {
  if (errors.length > 0) {
    error('Error(s) has occurred')
    errors.forEach((item) => log(item))
  }

  if (warnings.length > 0) {
    warn('There is an warning(s), try checking it')
    warnings.forEach((item) => log(item))
  }
}

function waitingForChanges(time: number) {
  const idx = Math.floor(Math.random() * CHANGES_EMOJI.length)
  const emoji = CHANGES_EMOJI[idx]
  const text = isNaN(time) ? '' : ` in ${print.bold(`${time}ms`)}`

  log(print.dim(`[👀] build done${text}! watching for changes...`, emoji))
}

interface WatchModeOptions {
  clearConsole?: boolean
}

type EventOnChange = (
  bundleInfo: BundleInfoOutput,
  other: { initialized: boolean },
) => void

const defaultOptions = { clearConsole: true }

async function runWatchMode(
  config: webpackCompiler.AllowWebpackConfig,
  options: WatchModeOptions = defaultOptions,
  onChange?: EventOnChange,
) {
  let initialized = false

  const watcher = await webpackCompiler.watch(config, (err, stats) => {
    const shouldClean = initialized && options.clearConsole
    if (shouldClean) {
      clearConsole()
    }

    initialized = true

    if (err) {
      error('Error(s) has occurred')
      log(err)
      return
    }

    const bundleInfo = getBundleInfo(stats)
    if (!bundleInfo.done) {
      showErrorsAndWarnings(bundleInfo)
      return
    }

    const buildTime =
      ((stats || {}) as any).endTime - ((stats || {}) as any).startTime
    waitingForChanges(buildTime)

    if (typeof onChange === 'function') {
      onChange(bundleInfo, { initialized })
    }
  })

  return watcher
}

export default runWatchMode
