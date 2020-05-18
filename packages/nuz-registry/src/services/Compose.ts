import { validator, versionHelpers } from '@nuz/utils'
import { Types } from 'mongoose'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  ComposeId,
  CreateComposeData,
  Models,
  ModuleAsObject,
  ModuleId,
  RequiredModule,
  UserId,
} from '../types'

import Service from './Service'

class Compose extends Service<ComposeId> {
  constructor(readonly Collection: Models['Compose']) {
    super(Collection)
  }

  convertModulesToArray(modulesAsObject: ModuleAsObject) {
    const modules = Object.entries(modulesAsObject).map(([id, version]) => ({
      id,
      version,
    }))

    for (const item of modules) {
      if (!validator.moduleId(item.id)) {
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
    data: Omit<CreateComposeData, 'modules'> & {
      modules: RequiredModule[]
    },
  ) {
    const { name, modules } = data

    const creator = { type: CollaboratorTypes.creator, id: userId }
    const collaborators = [creator]

    const compose = new this.Collection({ name, collaborators, modules })
    try {
      await compose.save()
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Compose is already existed')
      }

      throw error
    }

    return compose
  }

  async delete(id: ComposeId) {
    const { ok, deletedCount } = await this.Collection.deleteOne({ _id: id })
    return { _id: id, ok, deleted: deletedCount }
  }

  async addModules(id: ComposeId, modules: RequiredModule[]) {
    const compose = await this.Collection.findOne({ _id: id }, { modules: 1 })
    if (!compose) {
      throw new Error('Compose is not found')
    }

    const moduleIds = modules.map((item) => item.id)
    const updatedModules = compose.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    updatedModules.push(...modules)
    compose.modules = updatedModules as Types.Array<RequiredModule>

    const result = await compose.save()

    return { _id: id }
  }

  async removeModules(id: ComposeId, moduleIds: ModuleId[]) {
    const compose = await this.Collection.findOne({ _id: id }, { modules: 1 })
    if (!compose) {
      throw new Error('Compose is not found')
    }

    const updatedModules = compose.modules.filter(
      (item) => !moduleIds.includes(item.id),
    )
    compose.modules = updatedModules as Types.Array<RequiredModule>

    const result = await compose.save()

    return { _id: id }
  }
}

export const createService = (collection: Models['Compose']) =>
  new Compose(collection)

export default Compose
