import chalk, { Chalk } from 'chalk'
import prettyFormat from 'pretty-format'
import prettyMs from 'pretty-ms'

export const pretty = prettyFormat

interface Printer extends Chalk {
  link: Chalk['green']
  name: Chalk['green']
  time: Chalk['bold']
}

const printer = new chalk.Instance()

Object.defineProperty(printer, 'name', {
  value: printer.cyan,
})
Object.defineProperty(printer, 'link', {
  value: printer.green,
})
Object.defineProperty(printer, 'time', {
  value: (ms: number | string) => printer.bold(prettyMs(Number(ms))),
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
