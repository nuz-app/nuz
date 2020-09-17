import { Models } from '../types'

import * as Compose from './Compose'
import * as Module from './Module'
import * as Scope from './Scope'
import * as User from './User'

export type Services = {
  User: User.default
  Module: Module.default
  Compose: Compose.default
  Scope: Scope.default
}

export function createServices(db: Models): Services {
  return {
    User: User.createService(db.User),
    Module: Module.createService(db.Module),
    Compose: Compose.createService(db.Compose),
    Scope: Scope.createService(db.Scope),
  }
}
