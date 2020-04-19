import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  AddCollaboratorData,
  CollaboratorTypes,
  CreateScopeData,
  Models,
  ScopeId,
  UserId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'
import * as scopeIdHelpers from '../utils/scopeIdHelpers'

class Scope {
  constructor(private readonly Collection: Models['Scope']) {}

  validateScopeId(id: string) {
    if (!scopeIdHelpers.validate(id)) {
      throw new Error(`${id} is invalid scope id`)
    }

    return id
  }

  async create(userId: UserId, data: CreateScopeData) {
    const { name } = data

    const creator = { type: CollaboratorTypes.creator, id: userId }
    const collaborators = [creator]

    const scope = new this.Collection({ name, collaborators })
    try {
      await scope.save()
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Scope is already existed')
      }

      throw error
    }

    console.log({ scope })
    return scope
  }

  async delete(id: ScopeId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })
    return { ok, deleted: deletedCount }
  }

  async verifyCollaborator(
    id: ScopeId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    const scope = await this.Collection.findOne(
      {
        _id: id,
      },
      { name: 1, collaborators: 1, createdAt: 1 },
    )
    if (!scope) {
      throw new Error('Scope is not found')
    }

    const collaborator = scope.collaborators.find((item) =>
      compareObjectId(item.id, userId),
    )
    if (!collaborator) {
      throw new Error('User does not include collaborators of scope')
    }

    const permissionIsDenied = !collaboratorTypesHelpers.verify(
      collaborator.type,
      requiredType,
    )
    if (permissionIsDenied) {
      throw new Error('Permission denied')
    }

    return scope
  }

  async addCollaborator(id: ScopeId, collaborator: AddCollaboratorData) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error('Scope is not found')
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: ScopeId, collaboratorId: UserId) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error('Scope is not found')
    }

    return { _id: id, mofitied, ok }
  }
}

export const createService = (collection: Models['Scope']) =>
  new Scope(collection)

export default Scope
