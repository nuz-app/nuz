import chalk, { Chalk } from 'chalk'

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

export const info = (...rest) =>
  console.log(`${printer.dim('[info]')}`, ...rest)

export const success = (...rest) =>
  console.log(`${printer.greenBright('[success]')}`, ...rest)

export const warn = (...rest) =>
  console.warn(`${printer.yellow('[warn]')}`, ...rest)

export const error = (...rest) =>
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
  enableFeatures: config => {
    info(
      `Auto loaders will enable for feature with config: ${JSON.stringify(
        config,
        null,
        2,
      )}`,
    )
    log()
  },
}

export default printer as Printer
