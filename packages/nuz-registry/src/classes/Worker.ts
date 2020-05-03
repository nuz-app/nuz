import { pick, validator } from '@nuz/utils'
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
  PublishOptions,
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
import checkIsNewScope from '../utils/checkIsNewScope'
import createMongoConnection from '../utils/createMongoConnection'
import ensureVersionResources from '../utils/ensureVersionResources'
import parseModuleId from '../utils/parseModuleId'
import * as versionHelpers from '../utils/versionHelpers'

import Cache, { FactoryFn } from './Cache'

const pickVersionIfExisted = (tags, versions, requiredVersion) => {
  const useTag = tags.get(requiredVersion)
  const useVersion =
    useTag || versionHelpers.getMaxSatisfying(versions, requiredVersion)
  return useTag || useVersion
}

const pickVersionInfo = ({
  exportsOnly,
  createdAt,
  format,
  library,
  publisher,
  shared,
  externals,
}) => ({
  exportsOnly,
  createdAt,
  format,
  library,
  publisher,
  shared,
  externals,
})

class Worker {
  private readonly _connection: Connection
  private readonly _models: Models
  private readonly _services: Services

  constructor(options: MongoOptions, private readonly _cache: Cache) {
    const { url } = options

    if (!url) {
      throw new Error('Mongo URL is required!')
    }

    this._connection = createMongoConnection(url)
    this._models = createModels(this._connection)
    this._services = createServices(this._models)
  }

  /**
   * Prepare for worker
   */
  async prepare() {
    // do something great!
  }

  /**
   * Get all modules in scopes
   */
  async getAllModulesInScopes(
    scopeIds: ScopeId[],
    fields?: any,
    limit?: number,
  ) {
    const result = await this._services.Module.getAllInScopes(
      scopeIds,
      fields,
      limit,
    )
    return result
  }

  /**
   * Get a module by id
   */
  async getModule(moduleId: ModuleId, fields?: any) {
    const module = await this._services.Module.findOne(moduleId, fields)
    return module
  }

  /**
   * Get the modules by ids
   */
  async getModules(moduleIds: ModuleId[], fields?: any) {
    const modules = await this._services.Module.find(moduleIds, fields)
    return modules
  }

  /**
   * Publish a module
   */
  async publishModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    data: PublishModuleData,
    options: PublishOptions = {},
  ) {
    const { version, resolve } = data

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
    const parsedId = parseModuleId(moduleId)

    const moduleIsEixsted = !!module
    if (!moduleIsEixsted) {
      if (!parsedId) {
        throw new Error(`${moduleId} is invalid module id`)
      }

      const shouldVerifyScope = parsedId && parsedId.scope
      if (shouldVerifyScope) {
        const scope = await this.verifyCollaboratorOfScope(
          parsedId.scope,
          user._id,
          CollaboratorTypes.contributor,
        )

        data.scope = scope._id
      }

      if (!validator.moduleId(moduleId)) {
        throw new Error(
          'Module id is invalid. Contains only "a-z0-9-_" characters, starting and ending with "a-z0-9", length allows 6-72 characters included scope!',
        )
      }
    } else {
      // Check is version published
      const versionId = versionHelpers.encode(version)
      const versionIsExisted = module?.versions?.has(versionId)
      if (versionIsExisted) {
        throw new Error(
          `Module ${moduleId} was published version ${version} before!`,
        )
      }

      // Ensure fallback for the new version
      if (!options.fallback) {
        const list = Array.from<string>(
          module?.versions?.keys() || [],
        ).map((item) => versionHelpers.decode(item))

        if (list.length > 0) {
          list.push(version)
        }

        const ordered = versionHelpers.order(list, true)
        const idx = ordered.indexOf(version) + 1
        options.fallback = ordered[idx] || undefined
      }
    }

    const resolved = await ensureVersionResources(resolve)
    const transformed = {
      ...data,
      resolve: resolved as any,
    }

    const publishedResult = !moduleIsEixsted
      ? await this._services.Module.create(
          user._id,
          moduleId,
          transformed,
          options,
        )
      : await this._services.Module.addVersion(
          user._id,
          moduleId,
          transformed,
          options,
        )

    this._cache.clearAllRefsToModule(moduleId)

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

    const result = this._services.Module.setDeprecate(
      module._id,
      satisfies,
      deprecate,
    )
    return result
  }

  /**
   * Get collaborators of the module
   */
  async getCollaboratorsOfModule(moduleId: ModuleId) {
    const reuslt = await this._services.Module.listCollaborators(moduleId)
    return reuslt
  }

  /**
   * Get all modules of the user
   */
  async getModulesOfUser(userId: UserId) {
    const reuslt = await this._services.Module.getAllOf(userId, {
      _id: 1,
      name: 1,
      scope: 1,
      createdAt: 1,
    })
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
    const result = await this._services.Module.verifyCollaborator(
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

    const reuslt = await this._services.Module.addCollaborator(
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

    const reuslt = await this._services.Module.updateCollaborator(
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

    const reuslt = await this._services.Module.removeCollaborator(
      module._id,
      collaboratorId,
    )
    return reuslt
  }

  /**
   * Create a user
   */
  async createUser(data: CreateUserData) {
    if (!validator.email(data.email)) {
      throw new Error('Email is invalid!')
    } else if (!validator.name(data.name)) {
      throw new Error('Name is invalid. Length allows 4-32 characters!')
    } else if (!validator.username(data.username)) {
      throw new Error(
        'Username is invalid. Contains only "a-z0-9-_" characters, starting and ending with "a-z0-9", length allows 6-24 characters!',
      )
    } else if (!validator.password(data.password)) {
      throw new Error('Password is invalid. Length allows >=8 characters!')
    }

    const result = await this._services.User.create(data)
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

    const result = await this._services.User.update(user._id, data)
    return result
  }

  /**
   * Delete a user
   */
  // tslint:disable-next-line: no-empty
  async deleteUser() {}

  /**
   * Login to a user
   */
  async loginUser(username: string, password: string) {
    const user = await this._services.User.login(username, password)

    const result = await this._services.User.createToken(
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

    const result = await this._services.User.createToken(user._id, requiredType)
    return result
  }

  /**
   * Verify token of the user
   */
  private async verifyTokenOfUser(
    tokenId: TokenId,
    requiredType: UserAccessTokenTypes,
  ) {
    const result = await this._services.User.verifyToken(tokenId, requiredType)
    return result
  }

  /**
   * Delete a token from the user
   */
  async deleteTokenFromUser(userId: UserId, tokenId: TokenId) {
    const result = await this._services.User.deleteToken(userId, tokenId)
    return result
  }

  /**
   * Get a composition by id
   */
  async getComposition(compositionId: CompositionId, fields?: any) {
    const composition = await this._services.Composition.findOne(
      compositionId,
      fields,
    )
    return composition
  }

  /**
   * Get the compositions by ids
   */
  async getCompositions(compositionIds: CompositionId[], fields?: any) {
    const compositions = await this._services.Composition.find(
      compositionIds,
      fields,
    )
    return compositions
  }

  /**
   * Create a composition
   */
  async createComposition(tokenId: TokenId, data: CreateCompositionData) {
    const { name, modules: modulesAsObject } = data

    if (!validator.compositionId(name)) {
      throw new Error(
        'Composition id/name is invalid. Contains only "a-z0-9-_" characters, starting and ending with "a-z0-9", length allows 6-24 characters!',
      )
    }

    const modules = !modulesAsObject
      ? []
      : this._services.Composition.convertModulesToArray(modulesAsObject)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this._services.Composition.create(user._id, {
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

    const result = await this._services.Composition.delete(composition._id)
    return result
  }

  /**
   * Get collaborators of the composition
   */
  async getCollaboratorsOfComposition(compositionId: CompositionId) {
    const reuslt = await this._services.Composition.listCollaborators(
      compositionId,
    )
    return reuslt
  }

  /**
   * Get all compositions of the user
   */
  async getCompositionsOfUser(userId: UserId) {
    const reuslt = await this._services.Composition.getAllOf(userId)
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
    const result = await this._services.Composition.verifyCollaborator({
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

    const reuslt = await this._services.Composition.addCollaborator(
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

    const reuslt = await this._services.Composition.updateCollaborator(
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

    const reuslt = await this._services.Composition.removeCollaborator(
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
    const modules = this._services.Composition.convertModulesToArray(
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

    const result = await this._services.Composition.addModules(
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

    const result = await this._services.Composition.removeModules(
      composition._id,
      moduleIds,
    )
    return result
  }

  /**
   * Get a scope by id
   */
  async getScope(scopeId: ScopeId, fields?: any) {
    const scope = await this._services.Scope.findOne(scopeId, fields)
    return scope
  }

  /**
   * Get the scopes by ids
   */
  async getScopes(scopeIds: ScopeId[], fields?: any) {
    const scopes = await this._services.Scope.find(scopeIds, fields)
    return scopes
  }

  /**
   * Create a scope
   */
  async createScope(tokenId: TokenId, data: CreateScopeData) {
    const { name } = data

    if (!validator.scopeId(name)) {
      throw new Error(
        'Scope id/name is invalid. Contains only "a-z0-9-_" characters, starting and ending with "a-z0-9", length allows 6-24 characters!',
      )
    }

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this._services.Scope.create(user._id, {
      name,
    })
    return pick(result, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a scope
   */
  async deleteScope(tokenId: TokenId, scopeId: ScopeId) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const scope = await this.verifyCollaboratorOfScope(
      scopeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const isNewScope = checkIsNewScope(scope.createdAt)
    if (!isNewScope) {
      throw new Error(`Scope can't be deleted by policy`)
    }

    const modulesPublished = await this.getAllModulesInScopes(
      [scopeId],
      { _id: 1 },
      1,
    )
    if (modulesPublished.length > 0) {
      throw new Error(`Scope can't be deleted by policy`)
    }

    const result = await this._services.Scope.delete(scope._id)
    return result
  }

  /**
   * Get collaborators of the scope
   */
  async getCollaboratorsOfScope(scopeId: ScopeId) {
    const reuslt = await this._services.Scope.listCollaborators(scopeId)
    return reuslt
  }

  /**
   * Get all scopes of the user
   */
  async getScopesOfUser(userId: UserId) {
    const reuslt = await this._services.Scope.getAllOf(userId)
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
    const result = await this._services.Scope.verifyCollaborator({
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

    const reuslt = await this._services.Scope.addCollaborator(
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

    const reuslt = await this._services.Scope.updateCollaborator(
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

    const reuslt = await this._services.Scope.removeCollaborator(
      scope._id,
      collaboratorId,
    )
    return reuslt
  }

  /**
   * Fetch
   */
  async fetch(compositionId: CompositionId) {
    let factoryCache: FactoryFn | undefined
    if (this._cache) {
      const { data: cached, factory } = await this._cache.lookupComposition(
        compositionId,
      )
      if (cached) {
        return cached
      }
      factoryCache = factory
    }

    const composition = await this.getComposition(compositionId, {
      name: 1,
      modules: 1,
    })
    if (!composition) {
      throw new Error(`Composition ${compositionId} is not found`)
    }

    const moduleIds = (composition?.modules || []).map((item) => item.id)
    const modules = await this.getModules(moduleIds, {
      _id: 1,
      tags: 1,
      versions: 1,
    })

    const warnings: any[] = []
    const parsedModules = {}

    for (const item of composition.modules) {
      const requiredModule = modules.find((sub) => sub._id === item.id)
      if (requiredModule) {
        const allVersions = Array.from<string>(
          requiredModule.versions.keys(),
        ).map((sub) => versionHelpers.decode(sub))

        const useVersion = pickVersionIfExisted(
          requiredModule.tags,
          allVersions,
          item.version,
        )
        if (useVersion) {
          const upstreamInfo = requiredModule.versions.get(
            versionHelpers.encode(useVersion),
          )
          const { fallback } = upstreamInfo

          const useFallback =
            fallback &&
            pickVersionIfExisted(requiredModule.tags, allVersions, fallback)
          const fallbackInfo = requiredModule.versions.get(
            versionHelpers.encode(useFallback),
          )

          if (fallback && !fallbackInfo) {
            warnings.push({
              id: item.id,
              version: item.version,
              code: 'MODULE_FALLBACK_VERSION_NOT_FOUND',
              message: '',
            })
          }

          parsedModules[item.id] = {
            name: item.id,
            ...pickVersionInfo(upstreamInfo),
            upstream: upstreamInfo.resolve,
            fallback: fallbackInfo?.resolve,
          }
        } else {
          warnings.push({
            id: item.id,
            version: item.version,
            code: 'MODULE_UPSTREAM_VERSION_NOT_FOUND',
            message: '',
          })
        }
      } else {
        warnings.push({
          id: item.id,
          version: item.version,
          code: 'REQUIRED_MODULE_NOT_FOUND',
          message: '',
        })
      }
    }

    const data = { modules: parsedModules, warnings }
    if (factoryCache) {
      await factoryCache(data, moduleIds)
    }

    return data
  }
}

export default Worker
