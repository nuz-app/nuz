import path from 'path'
import { Arguments } from 'yargs'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'

import * as logs from './logs'

const execute = async ({ port: _port }: Arguments<{ port: number }>) => {
  const moduleDir = paths.cwd

  const configIsExisted = configHelpers.exists(moduleDir)
  if (!configIsExisted) {
    logs.configIsNotFound()
    return exit(1)
  }

  const moduleConfig = configHelpers.extract(moduleDir)
  if (!moduleConfig) {
    logs.configIsInvalid()
    return exit(1)
  }

  const { name, output, serve: serveConfig } = moduleConfig

  clearConsole()
  logs.notifyOnStart(name)

  const outputPath = path.dirname(output)
  const port = _port || 4000
  const server = serve(
    Object.assign({}, serveConfig, {
      port,
      dir: outputPath,
    }),
  )

  logs.guide({
    port,
    name: moduleConfig.name,
  })

  onExit(() => {
    server.close()
  })

  return true
}

export const setCommands = (yargs) => {
  yargs.command(
    'serve',
    'File serving and directory listing in the module',
    (yarg) =>
      yarg.option('port', {
        describe: 'Set port listen for server',
        type: 'number',
        required: false,
      }),
    execute,
  )
}
