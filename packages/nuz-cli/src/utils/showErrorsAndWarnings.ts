import print, { error, log, warn } from './print'

function showErrorsAndWarnings({
  errors,
  warnings,
}: {
  errors: string[]
  warnings: string[]
}) {
  if (errors.length > 0) {
    error(print.dim('Error(s) has occurred'))
    errors.forEach((item) => log(item))
  }

  if (warnings.length > 0) {
    warn(print.dim('There is an warning(s), try checking it'))
    warnings.forEach((item) => log(item))
  }
}

export default showErrorsAndWarnings
