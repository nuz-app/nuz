import { LASTEST_TAG, MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  Models,
  ModuleId,
  PublishModuleData,
  ScopeId,
  UserId,
} from '../types'

import * as versionHelpers from '../utils/versionHelpers'

import Service from './Service'

class Module extends Service<ModuleId> {
  constructor(readonly Collection: Models['Module']) {
    super(Collection)
  }

  async create(userId: UserId, data: PublishModuleData) {
    const {
      name,
      scope,
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
      publisher: userId,
    }

    const versionId = versionHelpers.encode(versionInfo.version)
    const versions = new Map([[versionId, versionInfo]])
    const tags = new Map([[LASTEST_TAG, version]])

    const module = new this.Collection({
      name,
      scope,
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

    return module
  }

  async addVersion(userId: UserId, data: PublishModuleData) {
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

    const versionInfo = {
      name,
      version,
      library,
      format,
      resolve,
      exportsOnly,
      alias,
      fallback,
      publisher: userId,
    }

    const versionId = versionHelpers.encode(versionInfo.version)

    const result = await this.Collection.updateOne(
      { _id: name },
      {
        $set: {
          [`versions.${versionId}`]: versionInfo,
          [`tags.${LASTEST_TAG}`]: version,
        },
      },
    )
    console.log({ result })
    return { _id: name }
  }

  async setDeprecate(
    id: ModuleId,
    satisfies: string[],
    deprecate: string | null,
  ) {
    const versionIds = satisfies.map((item) => versionHelpers.encode(item))
    const updateFields = versionIds.reduce(
      (acc, versionId) =>
        Object.assign(acc, { [`versions.${versionId}.deprecated`]: deprecate }),
      {},
    )

    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $set: updateFields },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process')
    }

    return { _id: id, mofitied, ok, versions: satisfies }
  }

  async getAllInScopes(scopeIds: ScopeId[], fields?: any, limit?: number) {
    const result = await this.Collection.find(
      { scope: { $in: scopeIds } },
      fields || { _id: 1 },
      limit && { limit },
    )
    return result
  }
}

export const createService = (collection: Models['Module']) =>
  new Module(collection)

export default Module
