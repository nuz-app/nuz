import path from 'path'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import exitIfModuleInsufficient from '../../utils/exitIfModuleInsufficient'
import * as fs from '../../utils/fs'
import { info, pretty } from '../../utils/print'
import { onExit } from '../../utils/process'
import serveServer from '../../utils/serve'

async function serve({ port = 4000 }: Arguments<{ port?: number }>) {
  const dir = paths.cwd

  const configIsExisted = configHelpers.exists(dir)
  if (!configIsExisted) {
    throw new Error(
      'Not found a config file, file named `nuz.config.js` in root dir',
    )
  }

  const moduleConfig = configHelpers.extract(dir)
  if (!moduleConfig) {
    throw new Error('Config file is invalid')
  }

  exitIfModuleInsufficient(moduleConfig)

  const { name, output, serve: serveConfig } = moduleConfig

  if (!fs.exists(output)) {
    throw new Error(`Output directory is not found, at ${output}`)
  }

  clearConsole()

  const outputDirname = path.dirname(output)
  const outputFilename = path.basename(output)
  const server = serveServer(
    Object.assign({}, serveConfig, {
      port,
      dir: outputDirname,
    }),
  )

  info(`Server was created to files serving for the module`)
  info(
    'Module information',
    pretty({
      name,
      port,
      url: `http://localhost:${port}/${outputFilename}`,
    }),
  )

  onExit(() => {
    server.close()
  })

  return false
}

export default serve
