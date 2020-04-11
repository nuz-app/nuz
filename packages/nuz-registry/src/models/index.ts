import { Connection } from 'mongoose'

import * as Composition from './composition'
import * as Module from './module'
import * as User from './user'

export const createModels = (connection: Connection) => ({
  User: User.createModel(connection),
  Module: Module.createModel(connection),
  Composition: Composition.createModel(connection),
})
