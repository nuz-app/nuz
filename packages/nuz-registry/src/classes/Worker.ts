import { pick } from '@nuz/utils'
import { Connection } from 'mongoose'

import {
  AddCollaboratorData,
  CollaboratorTypes,
  CreateCompositionData,
  CreateUserData,
  Models,
  MongoOptions,
  TObjectId,
  UpdateUserData,
  UserAccessTokenTypes,
} from '../types'

import { createModels } from '../models'
import { createServices, Services } from '../services'

import checkIsNewComposition from '../utils/checkIsNewComposition'
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
    return pick(result, ['_id', 'name', 'email', 'username', 'createdAt'])
  }
  async updateUser(tokenId: string, data: UpdateUserData) {
    const user = await this.verifyTokenForUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.User.update(user._id, data)
    return result
  }
  async deleteUser() {}
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
    tokenId: string,
    requiredType: UserAccessTokenTypes,
  ) {
    const result = await this.services.User.verifyToken(tokenId, requiredType)
    return result
  }
  async deleteTokenForUser(userId: TObjectId, tokenId: string) {
    const result = await this.services.User.deleteToken(userId, tokenId)
    return result
  }

  /**
   * Operations management Composition
   */
  async createComposition(
    tokenId: string,
    data: Omit<CreateCompositionData, 'userId'>,
  ) {
    const { name, modules } = data

    const user = await this.verifyTokenForUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.Composition.create({
      userId: user._id,
      name,
      modules,
    })
    return pick(result, ['_id', 'name', 'modules'])
  }
  async deleteComposition(tokenId: string, idOrName: TObjectId | string) {
    const user = await this.verifyTokenForUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const isNewComposition = checkIsNewComposition(composition.createdAt)
    if (!isNewComposition) {
      throw new Error(`Composition can't be deleted by policy`)
    }

    const result = await this.services.Composition.delete(composition._id)
    return result
  }
  async verifyCollaboratorOfComposition(
    idOrName: TObjectId | string,
    userId: TObjectId,
    requiredType: CollaboratorTypes,
  ) {
    const result = await this.services.Composition.verifyCollaborator(
      idOrName,
      userId,
      requiredType,
    )
    return result
  }
  async addCollaboratorToComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenForUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const reuslt = await this.services.Composition.addCollaborator(
      composition._id,
      collaborator,
    )
    return reuslt
  }
  async removeCollaboratorFromComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    collaboratorId: TObjectId,
  ) {
    const user = await this.verifyTokenForUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const reuslt = this.services.Composition.removeCollaborator(
      composition._id,
      collaboratorId,
    )
    return reuslt
  }
  async addModulesToComposition() {}
  async removeModulesFromComposition() {}
}

export default Worker
