export * from './types'

import * as health from './health'

import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteTokenFromUser from './deleteTokenFromUser'
import * as updateUser from './updateUser'

import * as addCollaboratorToComposition from './addCollaboratorToComposition'
import * as createComposition from './createComposition'
import * as deleteComposition from './deleteComposition'
import * as removeCollaboratorFromComposition from './removeCollaboratorFromComposition'

export default [
  health,

  createUser,
  updateUser,
  createTokenForUser,
  deleteTokenFromUser,

  createComposition,
  deleteComposition,
  addCollaboratorToComposition,
  removeCollaboratorFromComposition,
]
