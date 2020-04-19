import { Types } from 'mongoose'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  CompositionId,
  CreateCompositionData,
  Models,
  ModuleAsObject,
  ModuleId,
  RequiredModule,
  UserId,
} from '../types'

import * as moduleIdHelpers from '../utils/moduleIdHelpers'
import * as versionHelpers from '../utils/versionHelpers'

import Service from './Service'

class Composition extends Service<CompositionId> {
  constructor(readonly Collection: Models['Composition']) {
    super(Collection)
  }

  convertModulesToArray(modulesAsObject: ModuleAsObject) {
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
