export * from './types'

import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteTokenForUser from './deleteTokenForUser'
import * as health from './health'
import * as updateUser from './updateUser'

export default [
  health,
  createUser,
  updateUser,
  createTokenForUser,
  deleteTokenForUser,
]
