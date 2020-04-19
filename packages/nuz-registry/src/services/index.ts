import { Models } from '../types'

import * as Composition from './Composition'
import * as Module from './Module'
import * as Scope from './Scope'
import * as User from './User'

export type Services = {
  User: User.default
  Module: Module.default
  Composition: Composition.default
  Scope: Scope.default
}

export const createServices = (db: Models): Services => ({
  User: User.createService(db.User),
  Module: Module.createService(db.Module),
  Composition: Composition.createService(db.Composition),
  Scope: Scope.createService(db.Scope),
})
