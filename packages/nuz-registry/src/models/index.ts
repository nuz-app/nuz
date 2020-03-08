import { Connection } from 'mongoose'

import * as Module from './module'
import * as Permission from './permission'

export const createModels = (connection: Connection) => ({
  Module: Module.createModel(connection),
  Permission: Permission.createModel(connection),
})
