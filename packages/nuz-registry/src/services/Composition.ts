import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  CreateCompositionData,
  Models,
  TObjectId,
} from '../types'

import compareObjectId from '../utils/compareObjectId'

const DELETE_TIMEOUT = 24 * 60 * 60 * 1000

class Composition {
  constructor(private readonly Collection: Models['Composition']) {}

  private async findByName(name: string, fields?) {
    return this.Collection.findOne({ name }, fields || { _id: 1 })
  }

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

  async delete(userId: TObjectId, name: string) {
    const composition = await this.findByName(name, {
      collaborators: 1,
      createdAt: 1,
    })
    if (!composition) {
      throw new Error('Composition is not found')
    }

    const collaborator = composition.collaborators.find((item) =>
      compareObjectId(item.id, userId),
    )

    const now = new Date().getTime()
    const isLimitByTimeout =
      now - composition.createdAt.getTime() >= DELETE_TIMEOUT
    const isAvailableDelete = !isLimitByTimeout
    if (!isAvailableDelete) {
      throw new Error(`Composition can't be deleted by policy`)
    }

    if (!collaborator) {
      throw new Error('User does not include collaborators of composition')
    }

    const { ok, deletedCount } = await this.Collection.deleteOne({ name })
    return { ok, deleted: deletedCount }
  }
}

export const createService = (collection: Models['Composition']) =>
  new Composition(collection)

export default Composition
