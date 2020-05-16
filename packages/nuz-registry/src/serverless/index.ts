export * from './types'

import * as health from './health'
import * as root from './root'

import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteTokenFromUser from './deleteTokenFromUser'
import * as getComposeOfUser from './getComposeOfUser'
import * as getModulesOfUser from './getModulesOfUser'
import * as getScopesOfUser from './getScopesOfUser'
import * as loginUser from './loginUser'
import * as updateUser from './updateUser'

import * as addCollaboratorToCompose from './addCollaboratorToCompose'
import * as createCompose from './createCompose'
import * as deleteCompose from './deleteCompose'
import * as getCollaboratorsOfCompose from './getCollaboratorsOfCompose'
import * as getCompose from './getCompose'
import * as removeCollaboratorFromCompose from './removeCollaboratorFromCompose'
import * as removeModulesFromCompose from './removeModulesFromCompose'
import * as setModulesForCompose from './setModulesForCompose'
import * as updateCollaboratorOfCompose from './updateCollaboratorOfCompose'

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
  getComposeOfUser,
  getScopesOfUser,

  getCompose,
  createCompose,
  deleteCompose,
  getCollaboratorsOfCompose,
  addCollaboratorToCompose,
  removeCollaboratorFromCompose,
  updateCollaboratorOfCompose,
  setModulesForCompose,
  removeModulesFromCompose,

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
