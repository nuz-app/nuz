import { pick } from '@nuz/utils'
import { Connection } from 'mongoose'

import {
  AddCollaboratorData,
  CollaboratorTypes,
  CompositionId,
  CreateCompositionData,
  CreateUserData,
  Models,
  ModuleId,
  MongoOptions,
  PublishModuleData,
  RequiredModules,
  TokenId,
  UpdateUserData,
  UserAccessTokenTypes,
  UserId,
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
   * Publish a module
   */
  async publishModule(tokenId: TokenId, data: PublishModuleData) {
    const { name } = data

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.publish,
    )

    const module = await this.verifyCollaboratorOfModule(
      name,
      user._id,
      CollaboratorTypes.contributor,
      false,
    )
    const moduleIsEixsted = !!module

    const result = !moduleIsEixsted
      ? await this.services.Module.create(user._id, data)
      : await this.services.Module.publish(user._id, data)
    return result
  }
  async unpublishModule() {}
  async deprecateModule() {}
  async setTagForModule() {}

  /**
   * Verify collaborator of the module
   */
  async verifyCollaboratorOfModule(
    moduleId: ModuleId,
    userId: UserId,
    requiredType: CollaboratorTypes,
    throwIfNotFound: boolean,
  ) {
    const result = await this.services.Module.verifyCollaborator(
      moduleId,
      userId,
      requiredType,
      throwIfNotFound,
    )
    return result
  }
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
  async updateUser(tokenId: TokenId, data: UpdateUserData) {
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
    tokenId: TokenId,
    requiredType: UserAccessTokenTypes,
  ) {
    const result = await this.services.User.verifyToken(tokenId, requiredType)
    return result
  }

  /**
   * Delete a token from the user
   */
  async deleteTokenFromUser(userId: UserId, tokenId: TokenId) {
    const result = await this.services.User.deleteToken(userId, tokenId)
    return result
  }

  /**
   * Create a composition
   */
  async createComposition(tokenId: TokenId, data: CreateCompositionData) {
    const { name, modules } = data

    this.services.Composition.validateModules(modules)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.Composition.create(user._id, {
      name,
      modules,
    })
    return pick(result, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a composition
   */
  async deleteComposition(tokenId: TokenId, compositionId: CompositionId) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      compositionId,
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
    compositionId: CompositionId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    const result = await this.services.Composition.verifyCollaborator(
      compositionId,
      userId,
      requiredType,
    )
    return result
  }

  /**
   * Add collaborator to the composition
   */
  async addCollaboratorToComposition(
    tokenId: TokenId,
    compositionId: CompositionId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      compositionId,
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
    tokenId: TokenId,
    compositionId: CompositionId,
    collaboratorId: UserId,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      compositionId,
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
    tokenId: TokenId,
    compositionId: CompositionId,
    modules: RequiredModules,
  ) {
    this.services.Composition.validateModules(modules)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      compositionId,
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
    tokenId: TokenId,
    compositionId: CompositionId,
    moduleIds: ModuleId[],
  ) {
    this.services.Composition.validateModuleIds(moduleIds)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const composition = await this.verifyCollaboratorOfComposition(
      compositionId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const result = await this.services.Composition.removeModules(
      composition._id,
      moduleIds,
    )
    return result
  }
}

export default Worker
