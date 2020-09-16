import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'
import print, { info, log } from '../../utils/print'

const ACCESS_TOKEN_TYPES = Object.values(UserAccessTokenTypes)

interface UserCreateTokenOptions
  extends Arguments<{ type: UserAccessTokenTypes }> {}

async function createToken(options: UserCreateTokenOptions): Promise<boolean> {
  const { type } = options

  if (!ACCESS_TOKEN_TYPES.includes(type)) {
    throw new Error(`Type is not supported, please check its value.`)
  }

  // Check permissions before executing.
  const authentication = await Config.requireAs(type)

  // Create a request to perform this action.
  const request = await Worker.createTokenForUser(type)
  const accessToken = request?.data?.accessToken
  if (!accessToken) {
    throw new Error('The received data is not correct, please try again later.')
  }

  info(
    `Token ${print.dim(accessToken.value)} with type ${print.bold(
      accessToken.type,
    )} for user ${print.name(
      authentication.username,
    )} has been successfully created.`,
  )
  log()

  return true
}

export default createToken
