import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  AddCollaboratorData,
  CollaboratorTypes,
  CompositionId,
  CreateCompositionData,
  Models,
  ModuleId,
  RequiredModules,
  UserId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'
import validateModuleId from '../utils/validateModuleId'

class Composition {
  constructor(private readonly Collection: Models['Composition']) {}

  validateModuleIds(moduleIds: string[]) {
    for (const moduleId of moduleIds) {
      if (!validateModuleId(moduleId)) {
        throw new Error(`${moduleId} is invalid module id`)
      }
    }

    return true
  }

  validateModules(modules: RequiredModules) {
    const moduleIds = Array.from(modules.keys())

    return this.validateModuleIds(moduleIds)
  }

  async create(userId: UserId, data: CreateCompositionData) {
    const { name, modules } = data

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

  async delete(id: CompositionId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })
    return { ok, deleted: deletedCount }
  }

  async verifyCollaborator(
    id: CompositionId,
    userId: UserId,
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

  async addCollaborator(id: CompositionId, collaborator: AddCollaboratorData) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: CompositionId, collaboratorId: UserId) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error('Composition is not found')
    }

    return { _id: id, mofitied, ok }
  }

  async addModules(id: CompositionId, modules: RequiredModules) {
    const composition = await this.Collection.findOne(
      { _id: id },
      { modules: 1 },
    )
    if (!composition) {
      throw new Error('Composition is not found')
    }

    const moduleIds = Array.from(modules.keys())
    for (const moduleId of moduleIds) {
      const moduleVersion = modules.get(moduleId)
      if (!moduleVersion) {
        throw new Error(`Invalid version of module ${module}`)
      }

      composition.modules.set(moduleId, moduleVersion)
    }

    const result = await composition.save()
    console.log({ result })

    return { _id: id }
  }

  async removeModules(id: CompositionId, moduleIds: ModuleId[]) {
    const composition = await this.Collection.findOne(
      { _id: id },
      { modules: 1 },
    )
    if (!composition) {
      throw new Error('Composition is not found')
    }

    for (const moduleId of moduleIds) {
      composition.modules.delete(moduleId)
    }

    const result = await composition.save()
    console.log({ result })

    return { _id: id }
  }
}

export const createService = (collection: Models['Composition']) =>
  new Composition(collection)

export default Composition
