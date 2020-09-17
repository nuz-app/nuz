import { MODULE_LATEST_TAG } from '@nuz/shared'
import { versionHelpers } from '@nuz/utils'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CollaboratorTypes,
  Models,
  ModuleId,
  PublishModuleData,
  PublishOptions,
  ScopeId,
  UserId,
} from '../types'

import Service from './Service'

class Module extends Service<ModuleId> {
  constructor(readonly Collection: Models['Module']) {
    super(Collection)
  }

  async create(
    userId: UserId,
    moduleId: ModuleId,
    data: PublishModuleData,
    options?: PublishOptions,
  ) {
    const {
      scope,
      version,
      library,
      format,
      resolve,
      files,
      sizes,
      exportsOnly,
      alias,
      details,
    } = data

    const { fallback } = Object.assign({}, options)

    // Created report version for the module.
    const reportVersion = {
      version,
      library,
      format,
      resolve,
      files,
      sizes,
      exportsOnly,
      alias,
      fallback,
      details,
      publisher: userId,
    }

    // Created versions and tags maps.
    const versions = new Map([
      [versionHelpers.encode(reportVersion.version), reportVersion],
    ])
    const tags = new Map([[MODULE_LATEST_TAG, version]])

    // Create a new module instance.
    const instance = new this.Collection({
      name: moduleId,
      scope,
      // The creator information is inserted first in the collaborators list.
      collaborators: [{ type: CollaboratorTypes.creator, id: userId }],
      tags,
      versions,
    })

    try {
      // Inserted the new module to database.
      await instance.save()

      return instance
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Module is already existed.')
      }

      throw error
    }
  }

  async addVersion(
    userId: UserId,
    moduleId: ModuleId,
    data: PublishModuleData,
    options?: PublishOptions,
  ) {
    const {
      version,
      library,
      format,
      resolve,
      files,
      sizes,
      exportsOnly,
      alias,
      details,
    } = data

    const { fallback } = options || {}

    // Created report version for the module.
    const reportVersion = {
      version,
      library,
      format,
      resolve,
      files,
      sizes,
      exportsOnly,
      alias,
      fallback,
      details,
      publisher: userId,
    }

    //
    const versionId = versionHelpers.encode(reportVersion.version)

    // Updated new version into the module document.
    await this.Collection.updateOne(
      { _id: moduleId },
      {
        $set: {
          [`versions.${versionId}`]: reportVersion,
          [`tags.${MODULE_LATEST_TAG}`]: version,
        },
      },
    )

    return { _id: moduleId }
  }

  async setDeprecate(
    id: ModuleId,
    satisfies: string[],
    deprecate: string | null,
  ) {
    // Look for satisfying versions and set deprecated message.
    const updateFields = satisfies
      .map((item) => versionHelpers.encode(item))
      .reduce(
        (acc, versionId) =>
          Object.assign(acc, {
            [`versions.${versionId}.deprecated`]: deprecate,
          }),
        {},
      )

    // Updated the module document.
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $set: updateFields },
    )

    if (mofitied === 0) {
      throw new Error('There was an error during the update process.')
    }

    return { _id: id, mofitied, ok, versions: satisfies }
  }

  async getAllInScopes(scopeIds: ScopeId[], fields?: any, limit?: number) {
    const selectedModules = await this.Collection.find(
      { scope: { $in: scopeIds } },
      fields || { _id: 1 },
      !limit ? { limit: 1 } : { limit },
    )

    return selectedModules
  }
}

export function createService(collection: Models['Module']) {
  return new Module(collection)
}

export default Module
