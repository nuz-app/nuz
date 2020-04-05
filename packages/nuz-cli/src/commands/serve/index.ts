import path from 'path'
import * as yargs from 'yargs'

import { CommandConfig, CommandTypes, ServeCommand } from '../../types/common'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'

import * as logs from './logs'

// @ts-ignore
const execute = async ({ port: _port }: yargs.Argv<ServeCommand>) => {
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

const config: CommandConfig = {
  type: CommandTypes.serve,
  description: 'File serving and directory listing in the module',
  transform: (yarg) =>
    yarg.option('port', {
      alias: 'p',
      describe: 'Set port listen for server',
      type: 'number',
      required: false,
    }),
  execute,
}

export default config
