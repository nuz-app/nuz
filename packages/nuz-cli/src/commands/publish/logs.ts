import print, {
  common,
  error,
  info,
  log,
  success,
  warn,
} from '../../utils/print'

export const notifyOnStart = (name: string, version: string) => {
  log()
  info(
    `Prepare to publish for ${print.name(name)} module, version ${print.cyan(
      version,
    )}!`,
  )
}

export const moduleIsPushling = () => {
  info(`Module is pushling...`)
}

export const distIsNotFound = (path: string) => {
  error(`Not found bundle folder at ${print.link(path)}.`)
}

export const statsIsNotFound = (path: string) => {
  error(`Not found stats file at ${print.link(path)}.`)
}

export const publishedIsDone = (name: string, version: string, data: any) => {
  success(
    `Version ${print.cyan(version)} of ${print.name(
      name,
    )} module was published !`,
  )
  info(`Details of response:`, print.magenta(JSON.stringify(data, null, 2)))
  log()
}

export const publishFailed = (errorDetails: string) => {
  error(`Have an error while publishing module`)
  log(errorDetails)
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
export const registryConfigIsInvalid = common.registryConfigIsInvalid
