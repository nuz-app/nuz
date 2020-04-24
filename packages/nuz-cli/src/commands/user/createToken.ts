import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { success } from '../../utils/print'

const typesAllowed = Object.values(UserAccessTokenTypes)

async function createToken({
  type,
}: Arguments<{ type: UserAccessTokenTypes }>) {
  if (!typesAllowed.includes(type)) {
    throw new Error(`${type} is invalid access token type`)
  }

  const auth = await Config.authRequired(type)
  const request = await Worker.createTokenForUser(type)
  const accessToken = request?.data?.accessToken
  if (!accessToken) {
    throw new Error('Missing access token details in response')
  }

  success(
    `Successfully created token ${print.dim(
      accessToken.value,
    )} type is ${print.bold(accessToken.type)} for ${print.name(
      auth.username,
    )} account`,
  )

  return true
}

export default createToken
