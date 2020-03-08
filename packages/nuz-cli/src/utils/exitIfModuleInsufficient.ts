import { ModuleConfig } from '../types'

import print, { error } from './print'
import { exit } from './process'

const exitIfModuleInsufficient = (moduleConfig: ModuleConfig) => {
  const { name, library, input, output } = moduleConfig || {}

  if (!name) {
    error(
      `Missing ${print.blue('name')} field in ${print.dim(
        'nuz.config.js',
      )} file, this is module name!`,
    )
    exit(1)
  }

  if (!library) {
    error(
      `Missing ${print.blue('library')} field in ${print.dim(
        'nuz.config.js',
      )} file, this is library name of module!`,
    )
    exit(1)
  }

  if (!input) {
    error(
      `Missing ${print.blue('input')} field in ${print.dim(
        'nuz.config.js',
      )} file!`,
    )
    exit(1)
  }

  if (!output) {
    error(
      `Missing ${print.blue('output')} field in ${print.dim(
        'nuz.config.js',
      )} file!`,
    )
    exit(1)
  }
}

export default exitIfModuleInsufficient
