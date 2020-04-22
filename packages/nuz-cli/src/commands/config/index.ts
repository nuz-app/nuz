import { Arguments } from 'yargs'

import User from '../../classes/User'

import handleOnCommand from '../../utils/handleOnCommand'
import print, { success } from '../../utils/print'
import showHelpIfInvalid from '../../utils/showHelpIfInvalid'

const setConfig = async ({
  key,
  value,
}: Arguments<{ key: string; value: string }>) => {
  const user = new User()

  await user.prepare()
  await user.setConfig(key, value)

  success(`Set ${print.dim(key)} value with ${print.dim(value)} successfully!`)
  return true
}

const getConfig = async ({ key }: Arguments<{ key: string }>) => {
  const user = new User()

  await user.prepare()
  const value = await user.getConfig(key)

  success(`Value of ${print.dim(key)}:`, print.dim(value))
  return true
}

const listConfig = async () => {
  const user = new User()

  await user.prepare()
  const value = await user.getConfig()

  success('Current config', value)
  return true
}

export const setCommands = (yargs) => {
  yargs.command('config', 'Manage configuration', (child) => {
    child.usage('usage: $0 config <item> [options]')

    child.command(
      'set <key> [value]',
      'Set configuration',
      (yarg) =>
        yarg
          .positional('key', {
            describe: null,
            type: 'string',
            required: true,
          })
          .positional('value', {
            describe: null,
            type: 'string',
            required: true,
          }),
      handleOnCommand(setConfig),
    )

    child.command(
      'get <key>',
      'Get configuration',
      (yarg) =>
        yarg.positional('key', {
          describe: null,
          type: 'string',
          required: true,
        }),
      getConfig,
    )

    child.command('list', 'List configuration', (yarg) => yarg, listConfig)

    showHelpIfInvalid(child, child.argv, 2)
  })
}
