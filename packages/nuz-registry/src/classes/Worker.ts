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

  // Operations management Module
  async publishModule() {}
  async unpublishModule() {}
  async deprecateModule() {}
  async setTagForModule() {}
  async addCollaboratorToModule() {}
  async removeCollaboratorToModule() {}

  /**
   * Create a user
   */
  async createUser(data: CreateUserData) {
    const result = await this.services.User.create(data)
    return pick(result, ['_id', 'name', 'email', 'username', 'createdAt'])
  }

  /**
   * Update information of the user
   */
  async updateUser(tokenId: string, data: UpdateUserData) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.User.update(user._id, data)
    return result
  }

  /**
   * Delete a user
   */
  async deleteUser() {}

  /**
   * Create a token for the user
   */
  async createTokenForUser(
    username: string,
    password: string,
    requiredType: UserAccessTokenTypes,
  ) {
    const user = await this.services.User.login(username, password)

    const result = await this.services.User.createToken(user._id, requiredType)
    return result
  }

  /**
   * Verify token of the user
   */
  private async verifyTokenOfUser(
    tokenId: string,
    requiredType: UserAccessTokenTypes,
  ) {
    const result = await this.services.User.verifyToken(tokenId, requiredType)
    return result
  }

  /**
   * Delete a token from the user
   */
  async deleteTokenFromUser(userId: TObjectId, tokenId: string) {
    const result = await this.services.User.deleteToken(userId, tokenId)
    return result
  }

  /**
   * Create a composition
   */
  async createComposition(
    tokenId: string,
    data: Omit<CreateCompositionData, 'userId'>,
  ) {
    const { name, modules } = data

    const user = await this.verifyTokenOfUser(
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

  /**
   * Delete a composition
   */
  async deleteComposition(tokenId: string, idOrName: TObjectId | string) {
    const user = await this.verifyTokenOfUser(
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

  /**
   * Verify collaborator of the composition
   */
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

  /**
   * Add collaborator to the composition
   */
  async addCollaboratorToComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
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

  /**
   * Remove collaborator from the composition
   */
  async removeCollaboratorFromComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    collaboratorId: TObjectId,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const reuslt = await this.services.Composition.removeCollaborator(
      composition._id,
      collaboratorId,
    )
    return reuslt
  }

  /**
   * Add the modules to the composition
   */
  async addModulesToComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    modules: string[],
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const result = await this.services.Composition.addModules(
      composition._id,
      modules,
    )
    return result
  }

  /**
   * Remove the modules from composition
   */
  async removeModulesFromComposition(
    tokenId: string,
    idOrName: TObjectId | string,
    modules: string[],
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      idOrName,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const result = await this.services.Composition.removeModules(
      composition._id,
      modules,
    )
    return result
  }
}

export default Worker
