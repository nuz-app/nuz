import { Connection } from 'mongoose'

import * as Compose from './compose'
import * as Module from './module'
import * as Scope from './scope'
import * as User from './user'

export const createModels = (connection: Connection) => ({
  User: User.createModel(connection),
  Module: Module.createModel(connection),
  Compose: Compose.createModel(connection),
  Scope: Scope.createModel(connection),
})
