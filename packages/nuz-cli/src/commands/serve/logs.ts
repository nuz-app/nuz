import print, { common, info, log, success } from '../../utils/print'

export const notifyOnStart = (name: string) => {
  info(`Starting development mode for ${print.name(name)} module!`)
}

export const guide = ({ port, name }) => {
  log()
  success(`Module ${print.name(name)} listening on port ${port}!`)
  log()
}

export const configIsNotFound = common.configIsNotFound
export const configIsInvalid = common.configIsInvalid
