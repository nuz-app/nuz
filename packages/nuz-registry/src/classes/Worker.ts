import { pick } from '@nuz/utils'
import { Connection } from 'mongoose'

import {
  AddCollaboratorData,
  CollaboratorTypes,
  CompositionId,
  CreateCompositionData,
  CreateScopeData,
  CreateUserData,
  Models,
  ModuleAsObject,
  ModuleDocument,
  ModuleId,
  MongoOptions,
  PublishModuleData,
  ScopeId,
  TokenId,
  UpdateUserData,
  UserAccessTokenTypes,
  UserId,
} from '../types'

import { createModels } from '../models'
import { createServices, Services } from '../services'

import checkIsCollaboratorAllowSet from '../utils/checkIsCollaboratorAllowSet'
import checkIsCollaboratorIncludes from '../utils/checkIsCollaboratorIncludes'
import checkIsNewComposition from '../utils/checkIsNewComposition'
import createMongoConnection from '../utils/createMongoConnection'
import ensureVersionResources from '../utils/ensureVersionResources'
import * as moduleIdHelpers from '../utils/moduleIdHelpers'
import * as versionHelpers from '../utils/versionHelpers'

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

  /**
   * Prepare for worker
   */
  async prepare() {}

  /**
   * Publish a module
   */
  async publishModule(tokenId: TokenId, data: PublishModuleData) {
    const { name, version, resolve } = data

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
    if (!moduleIsEixsted) {
      const parsedId = moduleIdHelpers.parse(name)
      if (!parsedId) {
        throw new Error(`${name} is invalid module id`)
      }

      const shouldVerifyScope = parsedId && parsedId.scope
      if (shouldVerifyScope) {
        const scope = await this.verifyCollaboratorOfScope(
          parsedId.scope,
          user._id,
          CollaboratorTypes.contributor,
        )
      }
    } else {
      // Check is version published
      const versionId = versionHelpers.encode(version)
      const versionIsExisted = module?.versions?.has(versionId)
      if (versionIsExisted) {
        throw new Error(
          `Module ${name} was published version ${version} before!`,
        )
      }

      // Ensure fallback for the new version
      if (!data.fallback) {
        const list = Array.from<string>(
          module?.versions?.keys() || [],
        ).map((item) => versionHelpers.decode(item))

        if (list.length > 0) {
          list.push(version)
        }

        const ordered = versionHelpers.order(list, true)
        const idxOfFallback = ordered.indexOf(version) + 1
        data.fallback = ordered[idxOfFallback] || undefined
      }
    }

    const resolved = await ensureVersionResources(resolve)
    const transformed = {
      ...data,
      resolve: resolved as any,
    }

    const publishedResult = !moduleIsEixsted
      ? await this.services.Module.create(user._id, transformed)
      : await this.services.Module.addVersion(user._id, transformed)
    return publishedResult
  }

  /**
   * Unpublish a module
   */
  async unpublishModule() {
    throw new Error(`Module can't be unpublish by policy`)
  }

  /**
   * Set deprecate for the module
   */
  async deprecateModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    version: string,
    deprecate: string | null,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.publish,
    )

    const module = await this.verifyCollaboratorOfModule(
      moduleId,
      user._id,
      CollaboratorTypes.contributor,
      false,
    )

    const versions = Array.from<string>(module.versions.keys()).map((item) =>
      versionHelpers.decode(item),
    )

    const satisfies = versionHelpers.getSatisfies(versions, version)
    if (satisfies.length === 0) {
      throw new Error(`Not found satisfies version with ${version}`)
    }

    const result = this.services.Module.setDeprecate(
      module._id,
      satisfies,
      deprecate,
    )
    return result
  }

  /**
   * Set a tag for the module
   */
  async setTagForModule() {}

  /**
   * Remove a tag for the module
   */
  async clearTagForModule() {}

  /**
   * Get collaborators of the module
   */
  async getCollaboratorsOfModule(moduleId: ModuleId) {
    const reuslt = await this.services.Module.listCollaborators(moduleId)
    return reuslt
  }

  /**
   * Verify collaborator of the module
   */
  async verifyCollaboratorOfModule(
    moduleId: ModuleId,
    userId: UserId,
    requiredType: CollaboratorTypes,
    throwIfNotFound?: boolean,
  ) {
    const fields = {
      _id: 1,
      name: 1,
      collaborators: 1,
      versions: 1,
      createdAt: 1,
    }
    const result = await this.services.Module.verifyCollaborator(
      {
        id: moduleId,
        userId,
        requiredType,
      },
      { throwIfNotFound, fields },
    )
    return result
  }

  /**
   * Add collaborator to the module
   */
  async addCollaboratorToModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const module = (await this.verifyCollaboratorOfModule(
      moduleId,
      user._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    const found = checkIsCollaboratorIncludes(
      module.collaborators,
      collaborator.id,
    )
    if (found) {
      throw new Error('Collaborator already exists in the Module')
    }

    const reuslt = await this.services.Module.addCollaborator(
      module._id,
      collaborator,
    )
    return reuslt
  }

  /**
   * Update collaborator of the module
   */
  async updateCollaboratorOfModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const module = (await this.verifyCollaboratorOfModule(
      moduleId,
      user._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    const isAllowToSet = checkIsCollaboratorAllowSet(
      module.collaborators,
      user._id,
      collaborator.type,
    )
    if (!isAllowToSet) {
      throw new Error('Permission denied')
    }

    const found = checkIsCollaboratorIncludes(
      module.collaborators,
      collaborator.id,
    )
    if (!found) {
      throw new Error('Collaborator not exists in the Module')
    }

    const reuslt = await this.services.Module.updateCollaborator(
      module._id,
      collaborator.id,
      collaborator.type,
    )
    return reuslt
  }

  /**
   * Remove collaborator from the module
   */
  async removeCollaboratorFromModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaboratorId: UserId,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const module = (await this.verifyCollaboratorOfModule(
      moduleId,
      user._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    const reuslt = await this.services.Module.removeCollaborator(
      module._id,
      collaboratorId,
    )
    return reuslt
  }

  /**
   * Create a user
   */
  async createUser(data: CreateUserData) {
    // TODO: should be validate email, name, username and password

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
   * Login to a user
   */
  async loginUser(username: string, password: string) {
    const user = await this.services.User.login(username, password)

    const result = await this.services.User.createToken(
      user._id,
      UserAccessTokenTypes.fullAccess,
    )
    return result
  }

  /**
   * Create a token for the user
   */
  async createTokenForUser(
    tokenId: TokenId,
    requiredType: UserAccessTokenTypes,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

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
    const { name, modules: modulesAsObject } = data

    // TODO: should be validate name

    const modules = this.services.Composition.convertModulesToArray(
      modulesAsObject,
    )

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
   * Get collaborators of the composition
   */
  async getCollaboratorsOfComposition(compositionId: CompositionId) {
    const reuslt = await this.services.Composition.listCollaborators(
      compositionId,
    )
    return reuslt
  }

  /**
   * Verify collaborator of the composition
   */
  async verifyCollaboratorOfComposition(
    compositionId: CompositionId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    const result = await this.services.Composition.verifyCollaborator({
      id: compositionId,
      userId,
      requiredType,
    })
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

    const found = checkIsCollaboratorIncludes(
      composition.collaborators,
      collaborator.id,
    )
    if (found) {
      throw new Error('Collaborator already exists in the Composition')
    }

    const reuslt = await this.services.Composition.addCollaborator(
      composition._id,
      collaborator,
    )
    return reuslt
  }

  /**
   * Update collaborator of the composition
   */
  async updateCollaboratorOfComposition(
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

    const isAllowToSet = checkIsCollaboratorAllowSet(
      composition.collaborators,
      user._id,
      collaborator.type,
    )
    if (!isAllowToSet) {
      throw new Error('Permission denied')
    }

    const found = checkIsCollaboratorIncludes(
      composition.collaborators,
      collaborator.id,
    )
    if (!found) {
      throw new Error('Collaborator not exists in the Composition')
    }

    const reuslt = await this.services.Composition.updateCollaborator(
      composition._id,
      collaborator.id,
      collaborator.type,
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
   * Set the modules for the composition
   */
  async setModulesForComposition(
    tokenId: TokenId,
    compositionId: CompositionId,
    modulesAsObject: ModuleAsObject,
  ) {
    const modules = this.services.Composition.convertModulesToArray(
      modulesAsObject,
    )

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

  /**
   * Create a scope
   */
  async createScope(tokenId: TokenId, data: CreateScopeData) {
    const { name } = data

    // TODO: should be validate name

    this.services.Scope.validateScopeId(name)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this.services.Scope.create(user._id, {
      name,
    })
    return pick(result, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a scope
   */
  async deleteScope(tokenId: TokenId, scopeId: ScopeId) {
    throw new Error(`Scope can't be deleted by policy`)
  }

  /**
   * Get collaborators of the scope
   */
  async getCollaboratorsOfScope(scopeId: ScopeId) {
    const reuslt = await this.services.Scope.listCollaborators(scopeId)
    return reuslt
  }

  /**
   * Verify collaborator of the scope
   */
  async verifyCollaboratorOfScope(
    scopeId: ScopeId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    const result = await this.services.Scope.verifyCollaborator({
      id: scopeId,
      userId,
      requiredType,
    })
    return result
  }

  /**
   * Add collaborator to the scope
   */
  async addCollaboratorToScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const scope = await this.verifyCollaboratorOfScope(
      scopeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const found = checkIsCollaboratorIncludes(
      scope.collaborators,
      collaborator.id,
    )
    if (found) {
      throw new Error('Collaborator already exists in the Scope')
    }

    const reuslt = await this.services.Scope.addCollaborator(
      scope._id,
      collaborator,
    )
    return reuslt
  }

  /**
   * Update collaborator of the scope
   */
  async updateCollaboratorOfScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const scope = await this.verifyCollaboratorOfScope(
      scopeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const isAllowToSet = checkIsCollaboratorAllowSet(
      scope.collaborators,
      user._id,
      collaborator.type,
    )
    if (!isAllowToSet) {
      throw new Error('Permission denied')
    }

    const found = checkIsCollaboratorIncludes(
      scope.collaborators,
      collaborator.id,
    )
    if (!found) {
      throw new Error('Collaborator not exists in the Scope')
    }

    const reuslt = await this.services.Scope.updateCollaborator(
      scope._id,
      collaborator.id,
      collaborator.type,
    )
    return reuslt
  }

  /**
   * Remove collaborator from the scope
   */
  async removeCollaboratorFromScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaboratorId: UserId,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const scope = await this.verifyCollaboratorOfScope(
      scopeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const reuslt = await this.services.Scope.removeCollaborator(
      scope._id,
      collaboratorId,
    )
    return reuslt
  }
}

export default Worker
