import { Types } from 'mongoose'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  ComposeId,
  CreateComposeData,
  Models,
  ModuleId,
  RequiredModule,
  UserId,
} from '../types'

import Service from './Service'

class Compose extends Service<ComposeId> {
  constructor(readonly Collection: Models['Compose']) {
    super(Collection)
  }

  async create(
    userId: UserId,
    data: Omit<CreateComposeData, 'modules'> & {
      modules: RequiredModule[]
    },
  ) {
    const { name, modules } = data

    // Create a new compose instance.
    const compose = new this.Collection({
      name,
      // The creator information is inserted first in the collaborators list.
      collaborators: [{ type: CollaboratorTypes.creator, id: userId }],
      modules,
    })

    try {
      // Inserted the new compose to database.
      await compose.save()

      return compose
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Compose is already existed.')
      }

      throw error
    }
  }

  async delete(id: ComposeId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })

    return { _id: id, ok, deleted: deletedCount }
  }

  async addModules(id: ComposeId, modules: RequiredModule[]) {
    const selectedCompose = await this.Collection.findOne(
      { _id: id },
      { modules: 1 },
    )

    //
    if (!selectedCompose) {
      throw new Error('Compose is not found')
    }

    // Processing and merging module information.
    const moduleIds = modules.map((item) => item.id)
    const updatedModules = selectedCompose.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    updatedModules.push(...modules)
    selectedCompose.modules = updatedModules as Types.Array<RequiredModule>

    // Updated modules information tothe compose
    await selectedCompose.save()

    return { _id: id }
  }

  async removeModules(id: ComposeId, moduleIds: ModuleId[]) {
    const selectedCompose = await this.Collection.findOne(
      { _id: id },
      { modules: 1 },
    )

    //
    if (!selectedCompose) {
      throw new Error('Compose is not found')
    }

    // Processing and merging module information.
    const updatedModules = selectedCompose.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    selectedCompose.modules = updatedModules as Types.Array<RequiredModule>

    // Updated modules information tothe compose
    await selectedCompose.save()

    return { _id: id }
  }
}

export function createService(collection: Models['Compose']) {
  return new Compose(collection)
}

export default Compose
