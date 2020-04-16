import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  AddCollaboratorData,
  CollaboratorTypes,
  CreateCompositionData,
  Models,
  TObjectId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'

class Composition {
  constructor(private readonly Collection: Models['Composition']) {}

  async create(data: CreateCompositionData) {
    const { userId, name, modules } = data

    const creator = { type: CollaboratorTypes.creator, id: userId }
    const collaborators = [creator]

    const composition = new this.Collection({ name, collaborators, modules })
    try {
      await composition.save()
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Composition is already existed')
      }

      throw error
    }

    console.log({ composition })
    return composition
  }

  async delete(id: TObjectId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })
    return { ok, deleted: deletedCount }
  }

  async verifyCollaborator(
    id: string,
    userId: TObjectId,
    requiredType: CollaboratorTypes,
  ) {
    const composition = await this.Collection.findOne(
      {
        _id: id,
      },
      { name: 1, collaborators: 1, createdAt: 1 },
    )
    if (!composition) {
      throw new Error('Composition is not found')
    }

    const collaborator = composition.collaborators.find((item) =>
      compareObjectId(item.id, userId),
    )
    if (!collaborator) {
      throw new Error('User does not include collaborators of composition')
    }

    const permissionIsDenied = !collaboratorTypesHelpers.verify(
      collaborator.type,
      requiredType,
    )
    if (permissionIsDenied) {
      throw new Error('Permission denied')
    }

    return composition
  }

  async addCollaborator(id: TObjectId, collaborator: AddCollaboratorData) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: TObjectId, collaboratorId: TObjectId) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok }
  }

  async addModules(id: TObjectId, modules: string[]) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { modules: { $each: modules } } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok, modules }
  }

  async removeModules(id: TObjectId, modules: string[]) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { modules: { $in: modules } } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok }
  }
}

export const createService = (collection: Models['Composition']) =>
  new Composition(collection)

export default Composition
