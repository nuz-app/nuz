import { Argv } from 'yargs'

import * as paths from '../paths'

import print from './print'
import readPackageJson from './readPackageJson'

function setUsage<T extends Argv<any>>(yargs: T, description: string): T {
  return (
    yargs
      // Show version information
      .version(readPackageJson(paths.tool).version as string)
      .describe('version', print.dim('Show version'))
      // Show help
      .help('help', print.dim('Show help'))
      // Show usage example
      .usage(`Usage: ${description}`)
      //
      .showHelpOnFail(
        false,
        print.dim('Specify --help for available options'),
      ) as T
  )
}

export default setUsage
