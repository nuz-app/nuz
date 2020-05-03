export * from './types'

import * as health from './health'
import * as root from './root'

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
import * as getComposition from './getComposition'
import * as removeCollaboratorFromComposition from './removeCollaboratorFromComposition'
import * as removeModulesFromComposition from './removeModulesFromComposition'
import * as setModulesForComposition from './setModulesForComposition'
import * as updateCollaboratorOfComposition from './updateCollaboratorOfComposition'

import * as addCollaboratorToScope from './addCollaboratorToScope'
import * as createScope from './createScope'
import * as deleteScope from './deleteScope'
import * as getCollaboratorsOfScope from './getCollaboratorsOfScope'
import * as getScope from './getScope'
import * as removeCollaboratorFromScope from './removeCollaboratorFromScope'
import * as updateCollaboratorOfScope from './updateCollaboratorOfScope'

import * as addCollaboratorToModule from './addCollaboratorToModule'
import * as deprecateModule from './deprecateModule'
import * as getCollaboratorsOfModule from './getCollaboratorsOfModule'
import * as getModule from './getModule'
import * as publishModule from './publishModule'
import * as removeCollaboratorFromModule from './removeCollaboratorFromModule'
import * as updateCollaboratorOfModule from './updateCollaboratorOfModule'

import * as fetch from './fetch'

export default [
  root,
  health,

  loginUser,
  createUser,
  updateUser,
  createTokenForUser,
  deleteTokenFromUser,
  getModulesOfUser,
  getCompositionsOfUser,
  getScopesOfUser,

  getComposition,
  createComposition,
  deleteComposition,
  getCollaboratorsOfComposition,
  addCollaboratorToComposition,
  removeCollaboratorFromComposition,
  updateCollaboratorOfComposition,
  setModulesForComposition,
  removeModulesFromComposition,

  getScope,
  createScope,
  deleteScope,
  getCollaboratorsOfScope,
  addCollaboratorToScope,
  removeCollaboratorFromScope,
  updateCollaboratorOfScope,

  getModule,
  publishModule,
  deprecateModule,
  getCollaboratorsOfModule,
  addCollaboratorToModule,
  removeCollaboratorFromModule,
  updateCollaboratorOfModule,

  fetch,
]
