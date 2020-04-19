export * from './types'

import * as health from './health'

import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteTokenFromUser from './deleteTokenFromUser'
import * as updateUser from './updateUser'

import * as addCollaboratorToComposition from './addCollaboratorToComposition'
import * as addModulesToComposition from './addModulesToComposition'
import * as createComposition from './createComposition'
import * as deleteComposition from './deleteComposition'
import * as removeCollaboratorFromComposition from './removeCollaboratorFromComposition'
import * as removeModulesFromComposition from './removeModulesFromComposition'

import * as addCollaboratorToScope from './addCollaboratorToScope'
import * as createScope from './createScope'
import * as deleteScope from './deleteScope'
import * as removeCollaboratorFromScope from './removeCollaboratorFromScope'

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
  addModulesToComposition,
  removeModulesFromComposition,

  createScope,
  deleteScope,
  addCollaboratorToScope,
  removeCollaboratorFromScope,
]
