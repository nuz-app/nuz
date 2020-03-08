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

// export const moduleIsBuilding = () => {
//   info(`Module is building...`)
// }

export const distIsNotFound = (path: string) => {
  error(`Not found bundle folder at ${print.link(path)}.`)
}

export const publishConfigIsInvalid = () => {
  error(`Publish config is invalid, it's required token and enpoint fields!`)
}

export const statsIsNotFound = (path: string) => {
  error(`Not found stats file at ${print.link(path)}.`)
}

export const publishedIsDone = (name: string, version: string) => {
  success(
    `Version ${print.cyan(version)} of ${print.name(
      name,
    )} module was published !`,
  )
  log()
}

export const publishFailed = err => {
  error(`Have an error while bundle module`)
  log(err)
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
