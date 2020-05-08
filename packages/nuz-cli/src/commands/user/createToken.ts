import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, success } from '../../utils/print'
import timer from '../../utils/timer'

const typesAllowed = Object.values(UserAccessTokenTypes)

async function createToken({
  type,
}: Arguments<{ type: UserAccessTokenTypes }>) {
  if (!typesAllowed.includes(type)) {
    throw new Error(`${type} is invalid access token type`)
  }

  const auth = await Config.authRequired(type)

  const tick = timer()
  const request = await Worker.createTokenForUser(type)
  const accessToken = request?.data?.accessToken
  if (!accessToken) {
    throw new Error('Missing access token details in response')
  }

  info(
    `Successfully created token ${print.dim(
      accessToken.value,
    )} type is ${print.bold(accessToken.type)} for ${print.name(
      auth.username,
    )} account`,
  )
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default createToken
