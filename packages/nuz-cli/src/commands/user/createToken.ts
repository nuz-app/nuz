import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

const ACCESS_TOKEN_TYPES = Object.values(UserAccessTokenTypes)

interface UserCreateTokenOptions
  extends Arguments<{ type: UserAccessTokenTypes }> {}

async function createToken(options: UserCreateTokenOptions): Promise<boolean> {
  const { type } = options

  if (!ACCESS_TOKEN_TYPES.includes(type)) {
    throw new Error(`Type is not supported, please check its value.`)
  }

  // Check permissions before executing
  const authentication = await Config.requireAs(type)

  const tick = timer()

  //
  const request = await Worker.createTokenForUser(type)
  const accessToken = request?.data?.accessToken
  if (!accessToken) {
    throw new Error('The received data is not correct, please try again later.')
  }

  info(
    `Successfully created token ${print.dim(
      accessToken.value,
    )} type is ${print.bold(accessToken.type)} for ${print.name(
      authentication.username,
    )} account`,
  )
  success(`Done in ${print.time(tick())}.`)

  return true
}

export default createToken
