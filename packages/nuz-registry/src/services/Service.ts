import {
  AddCollaboratorData,
  Collaborator,
  CollaboratorTypes,
  UserId,
} from '../types'

import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'

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

  async listCollaborators(id: T): Promise<Collaborator[]> {
    const modelName = this.Collection.modelName

    const item = await this.Collection.findOne({
      _id: id,
    })
    if (!item) {
      throw new Error(`${modelName} is not found`)
    }

    return item.collaborators
  }

  async verifyCollaborator(
    params: VerifyCollaboratorParams<T>,
    options: VerifyCollaboratorOptions = {},
  ) {
    const modelName = this.Collection.modelName

    const { id, userId, requiredType } = params
    const { throwIfNotFound = true, fields: _fields } = options

    const fields = _fields || { name: 1, collaborators: 1, createdAt: 1 }

    const item = await this.Collection.findOne(
      {
        _id: id,
      },
      fields,
    )
    if (!item) {
      if (throwIfNotFound) {
        throw new Error(`${modelName} is not found`)
      }

      return null
    }

    const collaborator = item.collaborators.find((item) => item.id === userId)
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

    return item
  }

  async addCollaborator(id: T, collaborator: AddCollaboratorData) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process')
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: T, collaboratorId: UserId) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process')
    }

    return { _id: id, mofitied, ok }
  }

  async updateCollaborator(
    id: T,
    collaboratorId: UserId,
    collaboratorType: CollaboratorTypes,
  ) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id, 'collaborators.id': collaboratorId },
      { $set: { 'collaborators.$.type': collaboratorType } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process')
    }

    return { _id: id, mofitied, ok }
  }
}

export default Service
