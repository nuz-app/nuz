import path from 'path'

import * as paths from '../paths'

import print from './print'
import readPackageJson from './readPackageJson'

const REQUIRED = ['name', 'version', 'input', 'output']

const internalsConfig = {} as any

function requireInternalConfig<T = any>(
  directory: string,
  required: boolean,
): T {
  // Check if loaded internal for this directory
  // return previous value.
  if (internalsConfig[directory]) {
    return internalsConfig[directory]
  }

  const resolveInternalConfig = paths.resolveInternalConfig(directory, false)
  if (!resolveInternalConfig && required) {
    throw new Error(`Not found configured for the project`)
  }

  const packageJson = readPackageJson(directory)
  if (!packageJson) {
    throw new Error('Not found package.json in the project')
  }

  try {
    const { name, version, library, source: input, main: output } = packageJson

    const internalConfig = Object.assign(
      {},
      { name, version, library, input, output },
      resolveInternalConfig && require(resolveInternalConfig),
    )

    if (required) {
      for (const field of REQUIRED) {
        if (!internalConfig[field]) {
          throw new Error(
            `Missing required field in the configuration of ${JSON.stringify(
              internalConfig.name,
            )}`,
          )
        }
      }
    }

    // Memoized internal config value, using next time
    internalsConfig[directory] = internalConfig

    return internalConfig
  } catch (error) {
    throw new Error(
      `Can't parse ${print.name(
        path.basename(resolveInternalConfig as string),
      )} file, details: ${error.message}.`,
    )
  }
}

export default requireInternalConfig
