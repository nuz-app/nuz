import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  CreateScopeData,
  Models,
  ScopeId,
  UserId,
} from '../types'

import Service from './Service'

class Scope extends Service<ScopeId> {
  constructor(readonly Collection: Models['Scope']) {
    super(Collection)
  }

  async create(userId: UserId, data: CreateScopeData) {
    const { name } = data

    // Create a new scope instance.
    const scope = new this.Collection({
      name,
      // The creator information is inserted first in the collaborators list.
      collaborators: [{ type: CollaboratorTypes.creator, id: userId }],
    })

    try {
      // Inserted the new scope to database.
      await scope.save()

      return scope
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Scope is already existed.')
      }

      throw error
    }
  }

  async delete(id: ScopeId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })

    return { _id: id, ok, deleted: deletedCount }
  }
}

export function createService(collection: Models['Scope']) {
  return new Scope(collection)
}

export default Scope
