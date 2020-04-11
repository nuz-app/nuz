import { Models } from '../types'

import * as Composition from './composition'
import * as Module from './module'
import * as User from './user'

export type Services = {
  User: User.default
  Module: Module.default
  Composition: Composition.default
}

export const createServices = (db: Models): Services => ({
  User: User.createService(db.User),
  Module: Module.createService(db.Module),
  Composition: Composition.createService(db.Composition),
})
