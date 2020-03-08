import path from 'path'
import { Argv } from 'yargs'

import { CommandConfig, CommandTypes, DevConfig } from '../../types/common'

import clearConsole from '../../utils/clearConsole'
import * as configHelpers from '../../utils/configHelpers'
import * as paths from '../../utils/paths'
import { exit, onExit } from '../../utils/process'
import serve from '../../utils/serve'

import * as logs from './logs'

// @ts-ignore
const execute = async ({ port: _port }: Argv<DevConfig>) => {
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

  const { name, output } = moduleConfig

  clearConsole()
  logs.notifyOnStart(name)

  const outputPath = path.dirname(output)
  const port = _port || 4000
  const server = serve({
    port,
    dir: outputPath,
  })

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
  description: 'Serve static resource in module',
  transform: yargs =>
    yargs.option('port', {
      alias: 'p',
      describe: 'Port to bind on',
      type: 'number',
      required: false,
    }),
  execute,
}

export default config
