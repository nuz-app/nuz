import { Types } from 'mongoose'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  AddCollaboratorData,
  CollaboratorTypes,
  CompositionId,
  CreateCompositionData,
  Models,
  ModuleAsObject,
  ModuleId,
  RequiredModule,
  UserId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'
import * as moduleIdHelpers from '../utils/moduleIdHelpers'
import * as versionHelpers from '../utils/versionHelpers'

class Composition {
  constructor(private readonly Collection: Models['Composition']) {}

  convertModulesToList(modulesAsObject: ModuleAsObject) {
    const modules = Object.entries(modulesAsObject).map(([id, version]) => ({
      id,
      version,
    }))

    for (const item of modules) {
      if (!moduleIdHelpers.validate(item.id)) {
        throw new Error(`${item.id} is invalid module id`)
      }

      if (!versionHelpers.checkIsValid(item.version)) {
        throw new Error(`${item.version} is invalid module version`)
      }
    }

    return modules
  }

  async create(
    userId: UserId,
    data: Omit<CreateCompositionData, 'modules'> & {
      modules: RequiredModule[]
    },
  ) {
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

  async addModules(id: CompositionId, modules: RequiredModule[]) {
    const composition = await this.Collection.findOne(
      { _id: id },
      { modules: 1 },
    )
    if (!composition) {
      throw new Error('Composition is not found')
    }

    const moduleIds = modules.map((item) => item.id)
    const updatedModules = composition.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    updatedModules.push(...modules)
    composition.modules = updatedModules as Types.Array<RequiredModule>

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

    const updatedModules = composition.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    composition.modules = updatedModules as Types.Array<RequiredModule>

    const result = await composition.save()
    console.log({ result })

    return { _id: id }
  }
}

export const createService = (collection: Models['Composition']) =>
  new Composition(collection)

export default Composition
