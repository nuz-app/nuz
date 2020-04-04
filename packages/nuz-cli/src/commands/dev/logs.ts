import print, { common, info, log, success } from '../../utils/print'

export const notifyOnStart = (name: string) => {
  info(`Starting development mode for ${print.name(name)} module!`)
}

export const guide = ({
  port,
  library,
  name,
  upstream,
}: {
  port: number
  library: string
  name: string
  upstream: string
}) => {
  success(`Module ${print.name(name)} listening on port ${port}!`)
  log()
  log(
    `Use module from upstream by config:`,
    print.yellow(JSON.stringify({ name, library, upstream }, null, 2)),
  )
  log('Or use link command to link module as local.')
  log()
  log()
}

export const cleanFolder = (path: string) => {
  info(`Clean up dist folder before run build at ${print.link(path)}.`)
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
export const enableFeatures = common.enableFeatures
export const waitingForChanges = common.waitingForChanges
export const buildFailed = common.buildFailed
export const showErrorsAndWarnings = common.showErrorsAndWarnings
