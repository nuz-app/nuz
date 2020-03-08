import { CHANGES_EMOJI } from '../../lib/const'

import print, {
  common,
  error,
  info,
  log,
  success,
  warn,
} from '../../utils/print'

export const notifyOnStart = (name: string) => {
  info(`Starting development mode for ${print.name(name)} module!`)
}

export const waitingForChanges = (time: number) => {
  const idx = Math.floor(Math.random() * CHANGES_EMOJI.length)
  const emoji = CHANGES_EMOJI[idx]

  log(
    print.dim(
      `[👀] done in ${print.bold(`${time}ms`)}! waiting for changes...`,
      emoji,
    ),
  )
}

export const buildFailed = errorDetails => {
  error(`Have an error while bundle module, details:`)
  log(errorDetails)
}

export const guide = ({ port, library, name, host }) => {
  success(`Module ${print.name(name)} listening on port ${port}!`)
  log()
  log(
    `Use module from host by config:`,
    print.yellow(JSON.stringify({ name, library, host }, null, 2)),
  )
  log('Or use link command to link module as local.')
  log()
  log()
}

export const showErrorsAndWarnings = ({ errors, warnings }) => {
  if (errors.length > 0) {
    error('Have some errors from stats of bundle')
    errors.forEach(item => log(item))
  }

  if (warnings.length > 0) {
    warn('Have some warnings from stats of bundle')
    warnings.forEach(item => log(item))
  }
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
export const enableFeatures = common.enableFeatures
