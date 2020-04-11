import { Connection } from 'mongoose'

import {
  Models,
  ModuleDocument,
  ModuleModel,
  PublishInfo,
  PublishOptions,
  RollbackInfo,
} from '../types'

import { createModels } from '../models'
import createMongoConnection from '../utils/createMongoConnection'
import ensureVersion from '../utils/ensureVersion'
import getEmptyPackage from '../utils/getEmptyPackage'
import * as versionHelpers from '../utils/versionHelpers'

import ModelDB from './ModelDB'

export interface MongoOptions {
  url: string
}

const checkIsVersionExisted = (pkg: ModuleDocument, version: string) =>
  !!(
    pkg &&
    pkg.versions &&
    pkg.versions[version && versionHelpers.encode(version)]
  )

class MongoDB implements ModelDB {
  private readonly connection: Connection
  private readonly db: Models

  constructor(
    private readonly secretKey: string | undefined,
    options: MongoOptions,
  ) {
    const { url } = options

    // Check if url is not provided
    if (!url) {
      throw new Error('Mongo URL is required!')
    }

    // Create connection to db
    this.connection = createMongoConnection(url)

    // Create models
    this.db = createModels(this.connection)
  }
}

export default MongoDB
