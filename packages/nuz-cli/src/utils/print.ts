import chalk, { Chalk } from 'chalk'

import { CHANGES_EMOJI } from '../lib/const'

interface Printer extends Chalk {
  link: Chalk['green']
  name: Chalk['green']
}

const printer = new chalk.Instance()

Object.defineProperty(printer, 'name', {
  value: printer.cyan,
})
Object.defineProperty(printer, 'link', {
  value: printer.green,
})

export const log = console.log

export const info = (...rest: any[]) =>
  console.log(`${printer.dim('[info]')}`, ...rest)

export const success = (...rest: any[]) =>
  console.log(`${printer.greenBright('[success]')}`, ...rest)

export const warn = (...rest: any[]) =>
  console.warn(`${printer.yellow('[warn]')}`, ...rest)

export const error = (...rest: any[]) =>
  console.error(`${printer.red('[error]')}`, ...rest)

export const common = {
  configIsNotFound: () => {
    error(
      `A configuration file could be named ${printer.blue(
        'nuz.config.js',
      )} in the current directory.`,
    )
  },
  configIsInvalid: () => {
    error(`Config file is invalid while extract, please check it!`)
  },
  enableFeatures: (config: any) => {
    info(
      `Auto loaders will enable for feature with config: ${JSON.stringify(
        config,
        null,
        2,
      )}`,
    )
    log()
  },
  waitingForChanges: (time: number) => {
    const idx = Math.floor(Math.random() * CHANGES_EMOJI.length)
    const emoji = CHANGES_EMOJI[idx]
    const text = isNaN(time) ? '' : ` in ${printer.bold(`${time}ms`)}`

    log(printer.dim(`[👀] build done${text}! watching for changes...`, emoji))
  },

  buildFailed: (errorDetails: string) => {
    error(`Have an error while bundle module, details:`)
    log(errorDetails)
  },

  showErrorsAndWarnings: ({
    errors,
    warnings,
  }: {
    errors: string[]
    warnings: string[]
  }) => {
    if (errors.length > 0) {
      error('Have some errors from stats of bundle')
      errors.forEach((item: string) => log(item))
    }

    if (warnings.length > 0) {
      warn('Have some warnings from stats of bundle')
      warnings.forEach((item: string) => log(item))
    }
  },

  registryConfigIsInvalid: () => {
    error(`Registry config is invalid, it's required token and enpoint fields!`)
  },
}

export default printer as Printer
