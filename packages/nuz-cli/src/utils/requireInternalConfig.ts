import path from 'path'

import * as paths from '../paths'
import { InternalConfiguration } from '../types'

import print from './print'
import readPackageJson from './readPackageJson'

const REQUIRED = ['name', 'version', 'input', 'output']

const internalsConfig = {} as any

export interface RequireInternalConfig {
  directory: string
  required: boolean
  dev: boolean
}

export interface ParsedInternalConfig extends InternalConfiguration {
  publicUrlOrPath: string
  isolated: boolean
}

function requireInternalConfig(
  config: RequireInternalConfig,
): ParsedInternalConfig {
  const { dev, required, directory } = config

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
    ) as ParsedInternalConfig

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

    // Add customizations from environment variables.
    internalConfig.publicUrlOrPath = paths.resolvePublicUrlOrPath(
      dev,
      process.env.PUBLIC_URL ?? internalConfig.publicPath ?? '/',
    )

    // Set defaults value
    internalConfig.isolated = !!internalConfig.isolated

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
