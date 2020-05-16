import {
  ensureOriginSlash,
  integrityHelpers,
  pick,
  validator,
} from '@nuz/utils'
import { Connection } from 'mongoose'

import {
  AddCollaboratorData,
  CollaboratorTypes,
  ComposeId,
  CreateComposeData,
  CreateScopeData,
  CreateUserData,
  Models,
  ModuleAsObject,
  ModuleDocument,
  ModuleId,
  MongoConfig,
  PublishModuleData,
  PublishOptions,
  Resource,
  ScopeId,
  StorageTypes,
  TokenId,
  UpdateUserData,
  UserAccessTokenTypes,
  UserId,
  WorkerOptions,
} from '../types'

import { createModels } from '../models'
import { createServices, Services } from '../services'

import checkIsCollaboratorAllowSet from '../utils/checkIsCollaboratorAllowSet'
import checkIsCollaboratorIncludes from '../utils/checkIsCollaboratorIncludes'
import checkIsNewCompose from '../utils/checkIsNewCompose'
import checkIsNewScope from '../utils/checkIsNewScope'
import createMongoConnection from '../utils/createMongoConnection'
import parseModuleId from '../utils/parseModuleId'
import validateAndTransformFiles from '../utils/validateAndTransformFiles'
import * as versionHelpers from '../utils/versionHelpers'

import Cache, { FactoryFn } from './Cache'
import Storage from './Storage'

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
  private readonly _cache: Cache
  private readonly _storageType: StorageTypes
  private readonly _storage: Storage | null
  private readonly _static: string | null

  constructor(config: MongoConfig, options: WorkerOptions) {
    const { url } = config

    if (!url) {
      throw new Error('Mongo URL is required!')
    }

    this._connection = createMongoConnection(url)
    this._models = createModels(this._connection)
    this._services = createServices(this._models)

    this._cache = options?.cache
    this._storageType = options?.storageType as StorageTypes
    this._storage = options?.storage
    this._static = options?.static
      ? (ensureOriginSlash(options.static) as string)
      : null
  }

  checkIsUseStorage(selfHosted: boolean) {
    return (
      this._storageType === StorageTypes.provided ||
      (this._storageType === StorageTypes.full && !selfHosted)
    )
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
    filesUploaded: any[],
    options: PublishOptions,
  ) {
    // tslint:disable-next-line: prefer-const
    let { fallback, selfHosted, static: staticOrigin } = Object.assign(
      {},
      options,
    )
    // tslint:disable-next-line: prefer-const
    let { version, resolve, files } = data

    const isUseStorage =
      this._storageType === StorageTypes.provided ||
      (this._storageType === StorageTypes.full && !selfHosted)
    const transformedFiles = isUseStorage
      ? validateAndTransformFiles(filesUploaded, data.files, {
          id: moduleId,
          version,
        })
      : []

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

    const staticIsNotMatched =
      ensureOriginSlash(staticOrigin as string) !==
      ensureOriginSlash(this._static as string)
    const staticIsAllowed =
      this._storageType !== StorageTypes.self && staticIsNotMatched
    if (staticIsAllowed) {
      throw new Error(
        `Static origin is not allowed by the registry server, allowed ${this._static}`,
      )
    }

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
      if (!fallback) {
        const list = Array.from<string>(
          module?.versions?.keys() || [],
        ).map((item) => versionHelpers.decode(item))

        if (list.length > 0) {
          list.push(version)
        }

        const ordered = versionHelpers.order(list, true)
        const idx = ordered.indexOf(version) + 1
        fallback = ordered[idx] || undefined
      }
    }

    if (isUseStorage) {
      const uploadResult = await this._storage?.uploadFiles(
        { id: moduleId, version },
        transformedFiles,
      )

      const bindStaticUrl = async (item: Resource) => {
        const url = await this._storage?.createUrl(moduleId, version, item.path)

        let integrity
        try {
          integrity = url && ((await integrityHelpers.url(url)) as string)
        } catch {
          throw new Error(
            `Can't get integrity of file, make sure the file was uploaded to the CDNs, url: ${url}.`,
          )
        }

        Object.assign(item, { url, integrity })
      }

      const promises = Promise.all(
        [...files, ...resolve.styles, resolve.main].map(bindStaticUrl),
      )
      await promises
    }

    const transformed = {
      ...data,
      files,
      resolve,
    }

    const publishedResult = !moduleIsEixsted
      ? await this._services.Module.create(user._id, moduleId, transformed, {
          fallback,
        })
      : await this._services.Module.addVersion(
          user._id,
          moduleId,
          transformed,
          { fallback },
        )

    this._cache?.clearAllRefsToModule(moduleId)

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
   * Get server config
   */
  async getConfig() {
    return {
      static: this._static,
      storageType: this._storageType,
    }
  }

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
   * Get a compose by id
   */
  async getCompose(composeId: ComposeId, fields?: any) {
    const compose = await this._services.Compose.findOne(composeId, fields)
    return compose
  }

  /**
   * Get the composes by ids
   */
  async getAllCompose(composeIds: ComposeId[], fields?: any) {
    const composes = await this._services.Compose.find(composeIds, fields)
    return composes
  }

  /**
   * Create a compose
   */
  async createCompose(tokenId: TokenId, data: CreateComposeData) {
    const { name, modules: modulesAsObject } = data

    if (!validator.composeId(name)) {
      throw new Error(
        'Compose id/name is invalid. Contains only "a-z0-9-_" characters, starting and ending with "a-z0-9", length allows 6-24 characters!',
      )
    }

    const modules = !modulesAsObject
      ? []
      : this._services.Compose.convertModulesToArray(modulesAsObject)

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const result = await this._services.Compose.create(user._id, {
      name,
      modules,
    })
    return pick(result, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a compose
   */
  async deleteCompose(tokenId: TokenId, composeId: ComposeId) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const isNewCompose = checkIsNewCompose(compose.createdAt)
    if (!isNewCompose) {
      throw new Error(`Compose can't be deleted by policy`)
    }

    const result = await this._services.Compose.delete(compose._id)
    return result
  }

  /**
   * Get collaborators of the compose
   */
  async getCollaboratorsOfCompose(composeId: ComposeId) {
    const reuslt = await this._services.Compose.listCollaborators(composeId)
    return reuslt
  }

  /**
   * Get all composes of the user
   */
  async getComposeOfUser(userId: UserId) {
    const reuslt = await this._services.Compose.getAllOf(userId)
    return reuslt
  }

  /**
   * Verify collaborator of the compose
   */
  async verifyCollaboratorOfCompose(
    composeId: ComposeId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    const result = await this._services.Compose.verifyCollaborator({
      id: composeId,
      userId,
      requiredType,
    })
    return result
  }

  /**
   * Add collaborator to the compose
   */
  async addCollaboratorToCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const found = checkIsCollaboratorIncludes(
      compose.collaborators,
      collaborator.id,
    )
    if (found) {
      throw new Error('Collaborator already exists in the Compose')
    }

    const reuslt = await this._services.Compose.addCollaborator(
      compose._id,
      collaborator,
    )
    return reuslt
  }

  /**
   * Update collaborator of the compose
   */
  async updateCollaboratorOfCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaborator: AddCollaboratorData,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const isAllowToSet = checkIsCollaboratorAllowSet(
      compose.collaborators,
      user._id,
      collaborator.type,
    )
    if (!isAllowToSet) {
      throw new Error('Permission denied')
    }

    const found = checkIsCollaboratorIncludes(
      compose.collaborators,
      collaborator.id,
    )
    if (!found) {
      throw new Error('Collaborator not exists in the Compose')
    }

    const reuslt = await this._services.Compose.updateCollaborator(
      compose._id,
      collaborator.id,
      collaborator.type,
    )
    return reuslt
  }

  /**
   * Remove collaborator from the compose
   */
  async removeCollaboratorFromCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaboratorId: UserId,
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const reuslt = await this._services.Compose.removeCollaborator(
      compose._id,
      collaboratorId,
    )
    return reuslt
  }

  /**
   * Set the modules for the compose
   */
  async setModulesForCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    modulesAsObject: ModuleAsObject,
  ) {
    const modules = this._services.Compose.convertModulesToArray(
      modulesAsObject,
    )

    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const result = await this._services.Compose.addModules(compose._id, modules)

    this._cache?.deleteCompose(compose._id)
    return result
  }

  /**
   * Remove the modules from compose
   */
  async removeModulesFromCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    moduleIds: ModuleId[],
  ) {
    const user = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    const compose = await this.verifyCollaboratorOfCompose(
      composeId,
      user._id,
      CollaboratorTypes.maintainer,
    )

    const result = await this._services.Compose.removeModules(
      compose._id,
      moduleIds,
    )

    this._cache?.deleteCompose(compose._id)
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
  async fetch(composeId: ComposeId) {
    let factoryCache: FactoryFn | undefined
    if (this._cache) {
      const { data: cached, factory } = await this._cache.lookupCompose(
        composeId,
      )
      if (cached) {
        return cached
      }
      factoryCache = factory
    }

    const compose = await this.getCompose(composeId, {
      name: 1,
      modules: 1,
    })
    if (!compose) {
      throw new Error(`Compose ${composeId} is not found`)
    }

    const moduleIds = (compose?.modules || []).map((item) => item.id)
    const modules = await this.getModules(moduleIds, {
      _id: 1,
      tags: 1,
      versions: 1,
    })

    const warnings: any[] = []
    const parsedModules = {}

    for (const item of compose.modules) {
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
