import fs from 'fs-extra'
import clearConsole from 'react-dev-utils/clearConsole'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import getOutputDirectory from '../../utils/getOutputDirectory'
import print, { info, log } from '../../utils/print'
import * as processHelpers from '../../utils/process'
import requireInternalConfig from '../../utils/requireInternalConfig'
import serve from '../../utils/serve'

export interface ServeMainOptions extends Arguments<{ port?: number }> {}

async function _serve(options: ServeMainOptions): Promise<boolean> {
  const { port } = Object.assign({ port: 4000 }, options)

  const directory = paths.cwd
  const internalConfig = requireInternalConfig(directory, true)

  const outputDirectory = getOutputDirectory(directory, internalConfig.output)
  if (!fs.existsSync(outputDirectory)) {
    throw new Error(
      `Not found build output directory, at ${print.link(outputDirectory)}.`,
    )
  }

  clearConsole()
  info('Preparing to service static resources...')
  log()

  const server = serve(
    Object.assign({}, internalConfig.serve, {
      port,
      directory: outputDirectory,
    }),
  )
  info(`Server was created to files serving for the module.`)
  log()

  processHelpers.onExit(() => {
    server.close()
  })

  return false
}

export default _serve
