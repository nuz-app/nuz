export * from './types'

import * as health from './health'

import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteTokenFromUser from './deleteTokenFromUser'
import * as getCompositionsOfUser from './getCompositionsOfUser'
import * as getModulesOfUser from './getModulesOfUser'
import * as getScopesOfUser from './getScopesOfUser'
import * as loginUser from './loginUser'
import * as updateUser from './updateUser'

import * as addCollaboratorToComposition from './addCollaboratorToComposition'
import * as createComposition from './createComposition'
import * as deleteComposition from './deleteComposition'
import * as getCollaboratorsOfComposition from './getCollaboratorsOfComposition'
import * as removeCollaboratorFromComposition from './removeCollaboratorFromComposition'
import * as removeModulesFromComposition from './removeModulesFromComposition'
import * as setModulesForComposition from './setModulesForComposition'
import * as updateCollaboratorOfComposition from './updateCollaboratorOfComposition'

import * as addCollaboratorToScope from './addCollaboratorToScope'
import * as createScope from './createScope'
import * as deleteScope from './deleteScope'
import * as getCollaboratorsOfScope from './getCollaboratorsOfScope'
import * as removeCollaboratorFromScope from './removeCollaboratorFromScope'
import * as updateCollaboratorOfScope from './updateCollaboratorOfScope'

import * as addCollaboratorToModule from './addCollaboratorToModule'
import * as deprecateModule from './deprecateModule'
import * as getCollaboratorsOfModule from './getCollaboratorsOfModule'
import * as publishModule from './publishModule'
import * as removeCollaboratorFromModule from './removeCollaboratorFromModule'
import * as updateCollaboratorOfModule from './updateCollaboratorOfModule'

export default [
  health,

  loginUser,
  createUser,
  updateUser,
  createTokenForUser,
  deleteTokenFromUser,
  getModulesOfUser,
  getCompositionsOfUser,
  getScopesOfUser,

  createComposition,
  deleteComposition,
  getCollaboratorsOfComposition,
  addCollaboratorToComposition,
  removeCollaboratorFromComposition,
  updateCollaboratorOfComposition,
  setModulesForComposition,
  removeModulesFromComposition,

  createScope,
  deleteScope,
  getCollaboratorsOfScope,
  addCollaboratorToScope,
  removeCollaboratorFromScope,
  updateCollaboratorOfScope,

  publishModule,
  deprecateModule,
  getCollaboratorsOfModule,
  addCollaboratorToModule,
  removeCollaboratorFromModule,
  updateCollaboratorOfModule,
]
