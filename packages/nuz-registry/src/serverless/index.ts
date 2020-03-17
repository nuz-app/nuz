import * as createToken from './createToken'
import * as deleteToken from './deleteToken'
import * as extendScope from './extendScope'
import * as fetch from './fetch'
import * as health from './health'
import * as publishModule from './publishModule'
import * as removeScope from './removeScope'
import * as setScope from './setScope'

export default [
  health,
  fetch,
  createToken,
  deleteToken,
  extendScope,
  removeScope,
  setScope,
  publishModule,
]
