import {
  AddCollaboratorData,
  Collaborator,
  CollaboratorTypes,
  UserId,
} from '../types'
import * as collaboratorTypeHelpers from '../utils/collaboratorTypeHelpers'

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

  async find(ids: T[], fields?: any) {
    const selectedItems = await this.Collection.find(
      { _id: { $in: ids } },
      fields || { _id: 1 },
    )

    return selectedItems
  }

  async findOne(id: T, fields?: any) {
    const selectedItem = await this.Collection.findOne(
      { _id: id },
      fields || { _id: 1 },
    )

    return selectedItem
  }

  async getAllOf(userId: UserId, fields?: any) {
    const selectedItems = await this.Collection.find(
      { 'collaborators.id': userId },
      fields || { _id: 1, name: 1, createdAt: 1 },
    )

    return selectedItems
  }

  async listCollaborators(id: T): Promise<Collaborator[]> {
    const name = this.Collection.modelName

    const selectedItem = await this.Collection.findOne(
      {
        _id: id,
      },
      { _id: 1, collaborators: 1 },
    )
    if (!selectedItem) {
      throw new Error(`${name} is not found.`)
    }

    return selectedItem
  }

  async verifyCollaborator(
    params: VerifyCollaboratorParams<T>,
    options: VerifyCollaboratorOptions = {},
  ) {
    const name = this.Collection.modelName

    //
    const { id, userId, requiredType } = params
    const { throwIfNotFound, fields: _fields } = Object.assign(
      { throwIfNotFound: true },
      options,
    )

    const selecteditem = await this.Collection.findOne(
      {
        _id: id,
      },
      _fields || { name: 1, collaborators: 1, createdAt: 1 },
    )
    if (!selecteditem) {
      if (throwIfNotFound) {
        throw new Error(`${name} is not found.`)
      }

      return null
    }

    const selectedCollaborator = selecteditem.collaborators.find(
      (coll) => coll.id === userId,
    )
    if (!selectedCollaborator) {
      throw new Error(`Cannot find user in the collaborators list.`)
    }

    const isDenied = !collaboratorTypeHelpers.verify(
      selectedCollaborator.type,
      requiredType,
    )
    if (isDenied) {
      throw new Error(
        'The collaborator does not have the authority to take this action.',
      )
    }

    return selecteditem
  }

  async addCollaborator(id: T, collaborator: AddCollaboratorData) {
    //
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $addToSet: { collaborators: collaborator } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process.')
    }

    return { _id: id, mofitied, ok, collaborator }
  }

  async removeCollaborator(id: T, collaboratorId: UserId) {
    //
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { collaborators: { id: collaboratorId } } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process.')
    }

    return { _id: id, mofitied, ok }
  }

  async updateCollaborator(
    id: T,
    collaboratorId: UserId,
    collaboratorType: CollaboratorTypes,
  ) {
    //
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id, 'collaborators.id': collaboratorId },
      { $set: { 'collaborators.$.type': collaboratorType } },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process.')
    }

    return { _id: id, mofitied, ok }
  }
}

export default Service
