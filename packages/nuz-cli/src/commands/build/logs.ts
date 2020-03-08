import print, {
  common,
  error,
  info,
  log,
  success,
  warn,
} from '../../utils/print'

export const notifyOnStart = (name: string) => {
  log()
  info(`Starting build production mode for ${print.name(name)} module!`)
}

export const moduleIsBuilding = () => {
  info(`Module is building...`)
}

export const cleanFolder = (path: string) => {
  info(`Clean up dist folder before run build at ${print.link(path)}.`)
}

export const bundleIsDone = (name: string, integrity: string) => {
  success(`Bundle ${print.name(name)} module was done!`)
  info(`Output file integrity is ${print.blueBright(integrity)}`)
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

export const buildFailed = err => {
  error(`Have an error while bundle module`)
  log(err)
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
export const enableFeatures = common.enableFeatures
