export * from './types'

import * as addCollaboratorToCompose from './addCollaboratorToCompose'
import * as addCollaboratorToModule from './addCollaboratorToModule'
import * as addCollaboratorToScope from './addCollaboratorToScope'
import * as createCompose from './createCompose'
import * as createScope from './createScope'
import * as createTokenForUser from './createTokenForUser'
import * as createUser from './createUser'
import * as deleteCompose from './deleteCompose'
import * as deleteScope from './deleteScope'
import * as deleteTokenFromUser from './deleteTokenFromUser'
import * as deprecateModule from './deprecateModule'
import * as fetchCompose from './fetchCompose'
import * as fetchModule from './fetchModule'
import * as getCollaboratorsOfCompose from './getCollaboratorsOfCompose'
import * as getCollaboratorsOfModule from './getCollaboratorsOfModule'
import * as getCollaboratorsOfScope from './getCollaboratorsOfScope'
import * as getCompose from './getCompose'
import * as getComposeOfUser from './getComposeOfUser'
import * as getModule from './getModule'
import * as getModulesOfUser from './getModulesOfUser'
import * as getScope from './getScope'
import * as getScopesOfUser from './getScopesOfUser'
import * as health from './health'
import * as loginUser from './loginUser'
import * as publishModule from './publishModule'
import * as removeCollaboratorFromCompose from './removeCollaboratorFromCompose'
import * as removeCollaboratorFromModule from './removeCollaboratorFromModule'
import * as removeCollaboratorFromScope from './removeCollaboratorFromScope'
import * as removeModulesFromCompose from './removeModulesFromCompose'
import * as root from './root'
import * as setModulesForCompose from './setModulesForCompose'
import * as updateCollaboratorOfCompose from './updateCollaboratorOfCompose'
import * as updateCollaboratorOfModule from './updateCollaboratorOfModule'
import * as updateCollaboratorOfScope from './updateCollaboratorOfScope'
import * as updateUser from './updateUser'

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

  fetchCompose,
  fetchModule,
]
