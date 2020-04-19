import { LASTEST_TAG, MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  Models,
  ModuleId,
  PublishModuleData,
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
}

export const createService = (collection: Models['Module']) =>
  new Module(collection)

export default Module
