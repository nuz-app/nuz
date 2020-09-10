import print, { error, log, warn } from './print'

interface Messages {
  errors: string[]
  warnings: string[]
}

function printBuildOutputMessages(messages: Messages): void {
  const { errors, warnings } = messages

  if (errors.length > 0) {
    error(print.dim('Error(s) has occurred'))
    errors.forEach((item) => log(item))
  }

  if (warnings.length > 0) {
    warn(print.dim('There is an warning(s), try checking it'))
    warnings.forEach((item) => log(item))
  }
}

export default printBuildOutputMessages
