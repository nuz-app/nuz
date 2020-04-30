import chalk, { Chalk } from 'chalk'
import prettyFormat from 'pretty-format'

export const pretty = prettyFormat

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
  console.log(`${printer.dim('[i]')}`, ...rest)

export const success = (...rest: any[]) =>
  console.log(`${printer.greenBright('[s]')}`, ...rest)

export const warn = (...rest: any[]) =>
  console.warn(`${printer.yellow('[w]')}`, ...rest)

export const error = (...rest: any[]) =>
  console.error(`${printer.red('[e]')}`, ...rest)

export default printer as Printer
