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
import * as updateCollaboratorOfComposition from './updateCollaboratorOfComposition'

import * as addCollaboratorToScope from './addCollaboratorToScope'
import * as createScope from './createScope'
import * as deleteScope from './deleteScope'
import * as removeCollaboratorFromScope from './removeCollaboratorFromScope'
import * as updateCollaboratorOfScope from './updateCollaboratorOfScope'

import * as addCollaboratorToModule from './addCollaboratorToModule'
import * as deprecateModule from './deprecateModule'
import * as publishModule from './publishModule'
import * as removeCollaboratorFromModule from './removeCollaboratorFromModule'
import * as updateCollaboratorOfModule from './updateCollaboratorOfModule'

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
  updateCollaboratorOfComposition,

  createScope,
  deleteScope,
  addCollaboratorToScope,
  removeCollaboratorFromScope,
  updateCollaboratorOfScope,

  publishModule,
  deprecateModule,
  addCollaboratorToModule,
  removeCollaboratorFromModule,
  updateCollaboratorOfModule,
]
