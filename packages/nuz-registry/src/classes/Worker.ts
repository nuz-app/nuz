import { Connection } from 'mongoose'

import {
  CreateUserData,
  Models,
  MongoOptions,
  TObjectId,
  UpdateUserData,
  UserAccessTokenTypes,
} from '../types'

import { createModels } from '../models'
import { createServices, Services } from '../services'

import createMongoConnection from '../utils/createMongoConnection'

class Worker {
  private readonly connection: Connection
  private readonly models: Models
  private readonly services: Services

  constructor(options: MongoOptions) {
    const { url } = options

    if (!url) {
      throw new Error('Mongo URL is required!')
    }

    this.connection = createMongoConnection(url)
    this.models = createModels(this.connection)
    this.services = createServices(this.models)
  }

  async prepare() {}

  /**
   * Operations management Module
   */
  async publishModule() {}
  async unpublishModule() {}
  async deprecateModule() {}
  async setTagForModule() {}
  async addCollaboratorToModule() {}
  async removeCollaboratorToModule() {}

  /**
   * Operations management User
   */
  async createUser(data: CreateUserData) {
    const result = await this.services.User.create(data)

    return { _id: result._id }
  }
  async updateUser(token: string, data: UpdateUserData) {
    const user = await this.verifyTokenForUser(
      token,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.User.update(user._id, data)
    return result
  }
  async createTokenForUser(
    username: string,
    password: string,
    requiredType: UserAccessTokenTypes,
  ) {
    const user = await this.services.User.login(username, password)

    const result = await this.services.User.createToken(user._id, requiredType)
    return result
  }
  private async verifyTokenForUser(
    token: string,
    requiredType: UserAccessTokenTypes,
  ) {
    const result = await this.services.User.verifyToken(token, requiredType)
    return result
  }
  async deleteTokenForUser(id: TObjectId, token: string) {
    const result = await this.services.User.deleteToken(id, token)
    return result
  }

  /**
   * Operations management Composition
   */
  async createComposition() {}
  async deleteComposition() {}
  async addCollaboratorToComposition() {}
  async removeCollaboratorToComposition() {}
  async addModulesToComposition() {}
  async removeModulesToComposition() {}
}

export default Worker
