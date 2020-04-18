import { LASTEST_TAG, MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  Models,
  ModuleId,
  PublishModuleData,
  UserId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'

class Module {
  constructor(private readonly Collection: Models['Module']) {}

  async create(userId: UserId, data: PublishModuleData) {
    const {
      name,
      version,
      library,
      format,
      resolve,
      exportsOnly,
      alias,
      fallback,
    } = data

    const creator = { type: CollaboratorTypes.creator, id: userId }
    const collaborators = [creator]

    const versionInfo = {
      name,
      version,
      library,
      format,
      resolve,
      exportsOnly,
      alias,
      fallback,
    }

    const versions = new Map([[version, versionInfo]])
    const tags = new Map([[LASTEST_TAG, version]])

    const module = new this.Collection({
      name,
      collaborators,
      tags,
      versions,
    })
    try {
      await module.save()
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Module is already existed')
      }

      throw error
    }

    console.log({ module })
    return module
  }

  async publish(userId: UserId, data: PublishModuleData) {}

  async verifyCollaborator(
    id: ModuleId,
    userId: UserId,
    requiredType: CollaboratorTypes,
    throwIfNotFound: boolean = true,
  ) {
    const module = await this.Collection.findOne(
      {
        _id: id,
      },
      { name: 1, collaborators: 1, createdAt: 1 },
    )
    if (!module) {
      if (throwIfNotFound) {
        throw new Error('Module is not found')
      }

      return null
    }

    const collaborator = module.collaborators.find((item) =>
      compareObjectId(item.id, userId),
    )
    if (!collaborator) {
      throw new Error('User does not include collaborators of module')
    }

    const permissionIsDenied = !collaboratorTypesHelpers.verify(
      collaborator.type,
      requiredType,
    )
    if (permissionIsDenied) {
      throw new Error('Permission denied')
    }

    return module
  }
}

export const createService = (collection: Models['Module']) =>
  new Module(collection)

export default Module
