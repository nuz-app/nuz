import { Argv } from 'yargs'

import print from './print'

function setUsage<T extends Argv<any>>(yargs: T, description: string): T {
  return yargs
    .usage(`Usage: ${description}`)
    .help('help', print.dim('Show help'))
    .version(false) as T
}

export default setUsage
