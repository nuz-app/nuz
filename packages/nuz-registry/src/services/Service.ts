import { AddCollaboratorData, CollaboratorTypes, UserId } from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import compareObjectId from '../utils/compareObjectId'

type VerifyCollaboratorParams<T> = {
  id: T
  userId: UserId
  requiredType: CollaboratorTypes
}

type VerifyCollaboratorOptions = {
  throwIfNotFound?: boolean
  fields?: { [field: string]: number }
}

class Service<T> {
  constructor(readonly Collection) {}

  async verifyCollaborator(
    params: VerifyCollaboratorParams<T>,
    options: VerifyCollaboratorOptions = {},
  ) {
    const modelName = this.Collection.modelName

    const { id, userId, requiredType } = params
    const { throwIfNotFound = true, fields: _fields } = options

    const fields = _fields || { name: 1, collaborators: 1, createdAt: 1 }

    const module = await this.Collection.findOne(
      {
        _id: id,
      },
      fields,
    )
    if (!module) {
      if (throwIfNotFound) {
        throw new Error(`${modelName} is not found`)
      }

      return null
    }

    const collaborator = module.collaborators.find((item) =>
      compareObjectId(item.id, userId),
    )
    if (!collaborator) {
      throw new Error(`User does not include collaborators of ${modelName}`)
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

  async addCollaborator(id: T, collaborator: AddCollaboratorData) {
    const modelName = this.Collection.modelName

    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error(`${modelName} is not found`)
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: T, collaboratorId: UserId) {
    const modelName = this.Collection.modelName

    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error(`${modelName} is not found`)
    }

    return { _id: id, mofitied, ok }
  }
}

export default Service
