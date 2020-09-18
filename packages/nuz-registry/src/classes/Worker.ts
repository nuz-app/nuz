import { MODULE_LATEST_TAG } from '@nuz/shared'
import {
  ensureOriginSlash,
  integrityHelpers,
  moduleIdHelpers,
  pick,
  validator,
  versionHelpers,
} from '@nuz/utils'
import { Connection } from 'mongoose'

import { createModels } from '../models'
import { Services, createServices } from '../services'
import {
  AddCollaboratorData,
  CollaboratorTypes,
  ComposeId,
  CreateComposeData,
  CreateScopeData,
  CreateUserData,
  DatabaseConfiguration,
  Models,
  ModuleAsObject,
  ModuleDocument,
  ModuleId,
  PublishModuleData,
  PublishOptions,
  Resource,
  ScopeId,
  StorageTypes,
  TokenId,
  UpdateUserData,
  UserAccessTokenTypes,
  UserId,
  VersionSizes,
  WorkerOptions,
} from '../types'
import checkIsNewCompose from '../utils/checkIsNewCompose'
import checkIsNewScope from '../utils/checkIsNewScope'
import convertModulesToArray from '../utils/convertModulesToArray'
import createMongoConnection from '../utils/createMongoConnection'
import ensureUploadedFiles from '../utils/ensureUploadedFiles'
import findCollaborator from '../utils/findCollaborator'
import getModuleAllowsOnly from '../utils/getModuleAllowsOnly'
import verifyCollaboratorPermission from '../utils/verifyCollaboratorPermission'

import Cache, {
  SetComposeCacheFactoryFn,
  SetModuleCacheFactoryFn,
} from './Cache'
import Storage from './Storage'

class Worker {
  /**
   * The MongoDB connection
   */
  private readonly connection: Connection

  /**
   * The document models
   */
  private readonly models: Models

  /**
   * The services worker
   */
  private readonly services: Services

  /**
   * The cache resolver
   */
  private readonly cacheResolver: Cache

  /**
   * Storage type
   */
  private readonly storageType: StorageTypes

  /**
   * Storage instance
   */
  private readonly storageInstance: Storage | null

  /**
   * CDN information
   */
  private readonly cdn: string | null

  constructor(db: DatabaseConfiguration, options: WorkerOptions) {
    if (!db || !db.url) {
      throw new Error(
        'Database configuration is not correct, please check again.',
      )
    }

    // Make connection to the database and models for it.
    this.connection = createMongoConnection(db.url)
    this.models = createModels(this.connection)

    // Use models to create the services.
    this.services = createServices(this.models)

    // Retained if the system uses cache resolver.
    this.cacheResolver = options?.cache

    const { storage } = options

    // Configure and set up storage.
    this.storageType = storage.type as StorageTypes
    this.storageInstance = storage.worker

    // Based on the storage type used will set the CDN information.
    this.cdn = options?.cdn ? (ensureOriginSlash(options.cdn) as string) : null
  }

  // tslint:disable-next-line: no-empty
  async prepare(): Promise<void> {}

  /**
   * Get all modules in scopes
   */
  async getAllModulesInScopes(
    scopeIds: ScopeId[],
    fields?: any,
    limit?: number,
  ) {
    return this.services.Module.getAllInScopes(scopeIds, fields, limit)
  }

  /**
   * Get a module by id
   */
  async getModule(moduleId: ModuleId, fields?: any) {
    return this.services.Module.findOne(moduleId, fields)
  }

  /**
   * Get the modules by ids
   */
  async getModules(moduleIds: ModuleId[], fields?: any) {
    return this.services.Module.find(moduleIds, fields)
  }

  /**
   * Publish a module
   */
  async publishModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    data: PublishModuleData,
    uploadedFiles: any[],
    options: PublishOptions,
  ) {
    const { fallback, selfHosted, cdn } = Object.assign({}, options)

    const { version, resolve, files: temporaryFiles } = data

    //
    let allowsFallback = fallback
    const isNotSelfHosted =
      this.storageType === StorageTypes.provided ||
      (this.storageType === StorageTypes.full && !selfHosted)

    // When building the system will use the public url
    // to generate the url for the source map.
    // This ensures the source map will exist properly.
    if (
      !isNotSelfHosted &&
      ensureOriginSlash(cdn as string) !== ensureOriginSlash(this.cdn as string)
    ) {
      throw new Error(
        `Using public url is not allowed, allowed from: ${this.cdn}.`,
      )
    }

    //
    const { files, sizes } = isNotSelfHosted
      ? ensureUploadedFiles(uploadedFiles, temporaryFiles, {
          id: moduleId,
          version,
          resolve,
        })
      : { files: [], sizes: null }

    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.publish,
    )

    //
    const parsedId = moduleIdHelpers.parser(moduleId)
    const selectedModule = await this.verifyCollaboratorOfModule(
      moduleId,
      currentUser._id,
      CollaboratorTypes.contributor,
      false,
    )

    const moduleIsEixsted = !!selectedModule
    if (!moduleIsEixsted) {
      // Check the validity of the module id.
      if (!parsedId) {
        throw new Error(`${moduleId} is not a valid module id.`)
      }

      // If the module is in scope,
      // must check the authority of the current user in that scope.
      if (parsedId.scope) {
        const selectedScope = await this.verifyCollaboratorOfScope(
          parsedId.scope,
          currentUser._id,
          CollaboratorTypes.contributor,
        )

        data.scope = selectedScope._id
      }

      // This module id check only appears when creating a new module.
      if (!validator.moduleId(moduleId)) {
        throw new Error(
          'Module id is invalid, contains only "a-z0-9-_" characters, start and end with "a-z0-9", length allows 6-72 characters included scope.',
        )
      }
    } else {
      // Check if this version has been previously published.
      const versionIsExisted = selectedModule?.versions?.has(
        versionHelpers.encode(version),
      )
      if (versionIsExisted) {
        throw new Error(
          `Version ${version} of the ${moduleId} module was published earlier.`,
        )
      }

      // Make sure that the system will try to select
      // the appropriate version for `fallback`.
      if (!allowsFallback) {
        const allVersions = Array.from<string>(
          selectedModule?.versions?.keys() || [],
        ).map((item) => versionHelpers.decode(item))

        if (allVersions.length > 0) {
          allVersions.push(version)
        }

        const orderedVersions = versionHelpers.order(allVersions, true)
        allowsFallback =
          orderedVersions[orderedVersions.indexOf(version) + 1] || undefined
      }
    }

    if (isNotSelfHosted) {
      // Proceed to upload the files to CDNs.
      await this.storageInstance?.uploadFiles({ id: moduleId, version }, files)

      // Update the url and additional security information
      // for the resource before it is written to the database.
      await Promise.all(
        [...files, ...resolve.styles, resolve.script].map(
          async (item: Resource) => {
            // Generate url for resources when uploaded to CDNs.
            const url = await this.storageInstance?.createUrl(
              moduleId,
              version,
              item.path,
            )

            let integrity
            try {
              integrity =
                item.integrity ||
                (url && ((await integrityHelpers.url(url)) as string))
            } catch {
              throw new Error(
                `Can't get integrity of file, make sure the file was uploaded to the CDNs, url: ${url}.`,
              )
            }

            Object.assign(item, { url, integrity })
          },
        ),
      )
    }

    const updatedModule = {
      ...data,
      files,
      sizes: sizes as VersionSizes,
      resolve,
    }

    const publishedResult = !moduleIsEixsted
      ? await this.services.Module.create(
          currentUser._id,
          moduleId,
          updatedModule,
          {
            fallback,
          },
        )
      : await this.services.Module.addVersion(
          currentUser._id,
          moduleId,
          updatedModule,
          {
            fallback,
          },
        )

    this.cacheResolver?.clearAllRefsToModule(moduleId)

    return publishedResult
  }

  /**
   * Unpublish a module
   */
  async unpublishModule() {
    throw new Error(
      `The module cannot be unpublished because it violates the policy.`,
    )
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
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.publish,
    )

    //
    const selectedModule = await this.verifyCollaboratorOfModule(
      moduleId,
      currentUser._id,
      CollaboratorTypes.contributor,
      false,
    )

    //
    const versions = Array.from<string>(
      selectedModule.versions.keys(),
    ).map((item) => versionHelpers.decode(item))

    //
    const satisfies = versionHelpers.getSatisfies(versions, version)
    if (satisfies.length === 0) {
      throw new Error(`Not found satisfies version with ${version}`)
    }

    //
    return this.services.Module.setDeprecate(
      selectedModule._id,
      satisfies,
      deprecate,
    )
  }

  /**
   * Get collaborators of the module
   */
  async getCollaboratorsOfModule(moduleId: ModuleId) {
    return this.services.Module.listCollaborators(moduleId)
  }

  /**
   * Get all modules of the user
   */
  async getModulesOfUser(userId: UserId) {
    return this.services.Module.getAllOf(userId, {
      _id: 1,
      name: 1,
      scope: 1,
      createdAt: 1,
    })
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
    return this.services.Module.verifyCollaborator(
      {
        id: moduleId,
        userId,
        requiredType,
      },
      {
        throwIfNotFound,
        fields: {
          _id: 1,
          name: 1,
          collaborators: 1,
          versions: 1,
          createdAt: 1,
        },
      },
    )
  }

  /**
   * Add collaborator to the module
   */
  async addCollaboratorToModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedModule = (await this.verifyCollaboratorOfModule(
      moduleId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    //
    const selectedCollaborator = findCollaborator(
      selectedModule.collaborators,
      collaborator.id,
    )
    if (selectedCollaborator) {
      throw new Error(`Collaborator already exists in this module.`)
    }

    //
    return this.services.Module.addCollaborator(
      selectedModule._id,
      collaborator,
    )
  }

  /**
   * Update collaborator of the module
   */
  async updateCollaboratorOfModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedModule = (await this.verifyCollaboratorOfModule(
      moduleId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    //
    if (
      !verifyCollaboratorPermission(
        selectedModule.collaborators,
        currentUser._id,
        collaborator.type,
      )
    ) {
      throw new Error(
        'Collaborator does not have permission to take this action.',
      )
    }

    const selectedCollaborator = findCollaborator(
      selectedModule.collaborators,
      collaborator.id,
    )
    if (!selectedCollaborator) {
      throw new Error(`Collaborator already exists in this module.`)
    }

    //
    return this.services.Module.updateCollaborator(
      selectedModule._id,
      collaborator.id,
      collaborator.type,
    )
  }

  /**
   * Remove collaborator from the module
   */
  async removeCollaboratorFromModule(
    tokenId: TokenId,
    moduleId: ModuleId,
    collaboratorId: UserId,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedModule = (await this.verifyCollaboratorOfModule(
      moduleId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )) as ModuleDocument

    //
    return this.services.Module.removeCollaborator(
      selectedModule._id,
      collaboratorId,
    )
  }

  /**
   * Create a user
   */
  async createUser(data: CreateUserData) {
    if (!validator.email(data.email)) {
      throw new Error(`Email is invalid.`)
    }

    if (!validator.name(data.name)) {
      throw new Error(`Name is invalid, length allows 4-32 characters.`)
    }

    if (!validator.username(data.username)) {
      throw new Error(
        `Username is invalid, contains only "a-z0-9-_" characters, start and end with "a-z0-9", length allows 4-24 characters!`,
      )
    }

    if (!validator.password(data.password)) {
      throw new Error(`Password is invalid, length allows >=8 characters.`)
    }

    //
    const createdUser = await this.services.User.create(data)

    //
    return pick(createdUser, ['_id', 'name', 'email', 'username', 'createdAt'])
  }

  /**
   * Update information of the user
   */
  async updateUser(tokenId: TokenId, data: UpdateUserData) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    return this.services.User.update(currentUser._id, data)
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
    //
    const currentUser = await this.services.User.login(username, password)

    //
    return this.services.User.createToken(
      currentUser._id,
      UserAccessTokenTypes.fullAccess,
    )
  }

  /**
   * Create a token for the user
   */
  async createTokenForUser(
    tokenId: TokenId,
    requiredType: UserAccessTokenTypes,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    return this.services.User.createToken(currentUser._id, requiredType)
  }

  /**
   * Verify token of the user
   */
  private async verifyTokenOfUser(
    tokenId: TokenId,
    requiredType: UserAccessTokenTypes,
  ) {
    //
    return this.services.User.verifyToken(tokenId, requiredType)
  }

  /**
   * Delete a token from the user
   */
  async deleteTokenFromUser(userId: UserId, tokenId: TokenId) {
    //
    return this.services.User.deleteToken(userId, tokenId)
  }

  /**
   * Get a compose by id
   */
  async getCompose(composeId: ComposeId, fields?: any) {
    //
    return this.services.Compose.findOne(composeId, fields)
  }

  /**
   * Get the composes by ids
   */
  async getAllCompose(composeIds: ComposeId[], fields?: any) {
    return this.services.Compose.find(composeIds, fields)
  }

  /**
   * Create a compose
   */
  async createCompose(tokenId: TokenId, data: CreateComposeData) {
    const { name, modules: modulesAsObject } = data

    if (!validator.composeId(name)) {
      throw new Error(
        'Compose id is invalid, contains only "a-z0-9-_" characters, start and end with "a-z0-9", length allows 4-24 characters.',
      )
    }

    //
    const modules = !modulesAsObject
      ? []
      : convertModulesToArray(modulesAsObject)

    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const createdCompose = await this.services.Compose.create(currentUser._id, {
      name,
      modules,
    })

    //
    return pick(createdCompose, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a compose
   */
  async deleteCompose(tokenId: TokenId, composeId: ComposeId) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    if (!checkIsNewCompose(selectedCompose.createdAt)) {
      throw new Error(
        `The compose cannot be deleted because it violates the policy.`,
      )
    }

    //
    return this.services.Compose.delete(selectedCompose._id)
  }

  /**
   * Get collaborators of the compose
   */
  async getCollaboratorsOfCompose(composeId: ComposeId) {
    //
    return this.services.Compose.listCollaborators(composeId)
  }

  /**
   * Get all composes of the user
   */
  async getComposeOfUser(userId: UserId) {
    //
    return this.services.Compose.getAllOf(userId)
  }

  /**
   * Verify collaborator of the compose
   */
  async verifyCollaboratorOfCompose(
    composeId: ComposeId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    //
    return this.services.Compose.verifyCollaborator({
      id: composeId,
      userId,
      requiredType,
    })
  }

  /**
   * Add collaborator to the compose
   */
  async addCollaboratorToCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    if (findCollaborator(selectedCompose.collaborators, collaborator.id)) {
      throw new Error(`Collaborator already exists in this compose.`)
    }

    //
    return this.services.Compose.addCollaborator(
      selectedCompose._id,
      collaborator,
    )
  }

  /**
   * Update collaborator of the compose
   */
  async updateCollaboratorOfCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    if (
      !verifyCollaboratorPermission(
        selectedCompose.collaborators,
        currentUser._id,
        collaborator.type,
      )
    ) {
      throw new Error(
        'Collaborator does not have permission to take this action.',
      )
    }

    //
    if (!findCollaborator(selectedCompose.collaborators, collaborator.id)) {
      throw new Error(`Collaborator is not exists in this compose.`)
    }

    //
    return this.services.Compose.updateCollaborator(
      selectedCompose._id,
      collaborator.id,
      collaborator.type,
    )
  }

  /**
   * Remove collaborator from the compose
   */
  async removeCollaboratorFromCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    collaboratorId: UserId,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    return this.services.Compose.removeCollaborator(
      selectedCompose._id,
      collaboratorId,
    )
  }

  /**
   * Set the modules for the compose
   */
  async setModulesForCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    modulesAsObject: ModuleAsObject,
  ) {
    //
    const modules = convertModulesToArray(modulesAsObject)

    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    const updated = await this.services.Compose.addModules(
      selectedCompose._id,
      modules,
    )

    //
    this.cacheResolver?.deleteCompose(selectedCompose._id)

    return updated
  }

  /**
   * Remove the modules from compose
   */
  async removeModulesFromCompose(
    tokenId: TokenId,
    composeId: ComposeId,
    moduleIds: ModuleId[],
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedCompose = await this.verifyCollaboratorOfCompose(
      composeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    const deleted = await this.services.Compose.removeModules(
      selectedCompose._id,
      moduleIds,
    )

    //
    this.cacheResolver?.deleteCompose(selectedCompose._id)

    return deleted
  }

  /**
   * Get a scope by id
   */
  async getScope(scopeId: ScopeId, fields?: any) {
    return this.services.Scope.findOne(scopeId, fields)
  }

  /**
   * Get the scopes by ids
   */
  async getScopes(scopeIds: ScopeId[], fields?: any) {
    return this.services.Scope.find(scopeIds, fields)
  }

  /**
   * Create a scope
   */
  async createScope(tokenId: TokenId, data: CreateScopeData) {
    const { name } = data

    if (!validator.scopeId(name)) {
      throw new Error(
        'Scope id is invalid, contains only "a-z0-9-_" characters, start and end with "a-z0-9", length allows 4-24 characters.',
      )
    }

    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const createdScope = await this.services.Scope.create(currentUser._id, {
      name,
    })

    //
    return pick(createdScope, ['_id', 'name', 'modules'])
  }

  /**
   * Delete a scope
   */
  async deleteScope(tokenId: TokenId, scopeId: ScopeId) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedScope = await this.verifyCollaboratorOfScope(
      scopeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    if (!checkIsNewScope(selectedScope.createdAt)) {
      throw new Error(
        `The scope cannot be deleted because it violates the policy.`,
      )
    }

    //
    const selectedModules = await this.getAllModulesInScopes(
      [scopeId],
      { _id: 1 },
      1,
    )
    if (selectedModules.length > 0) {
      throw new Error(
        `The scope cannot be deleted because it violates the policy.`,
      )
    }

    //
    return this.services.Scope.delete(selectedScope._id)
  }

  /**
   * Get collaborators of the scope
   */
  async getCollaboratorsOfScope(scopeId: ScopeId) {
    return this.services.Scope.listCollaborators(scopeId)
  }

  /**
   * Get all scopes of the user
   */
  async getScopesOfUser(userId: UserId) {
    return this.services.Scope.getAllOf(userId)
  }

  /**
   * Verify collaborator of the scope
   */
  async verifyCollaboratorOfScope(
    scopeId: ScopeId,
    userId: UserId,
    requiredType: CollaboratorTypes,
  ) {
    return this.services.Scope.verifyCollaborator({
      id: scopeId,
      userId,
      requiredType,
    })
  }

  /**
   * Add collaborator to the scope
   */
  async addCollaboratorToScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedScope = await this.verifyCollaboratorOfScope(
      scopeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    if (findCollaborator(selectedScope.collaborators, collaborator.id)) {
      throw new Error(`Collaborator already exists in this scope.`)
    }

    //
    return this.services.Scope.addCollaborator(selectedScope._id, collaborator)
  }

  /**
   * Update collaborator of the scope
   */
  async updateCollaboratorOfScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaborator: AddCollaboratorData,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedScope = await this.verifyCollaboratorOfScope(
      scopeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    if (
      !verifyCollaboratorPermission(
        selectedScope.collaborators,
        currentUser._id,
        collaborator.type,
      )
    ) {
      throw new Error(
        'Collaborator does not have permission to take this action.',
      )
    }

    //
    if (!findCollaborator(selectedScope.collaborators, collaborator.id)) {
      throw new Error(`Collaborator is not exists in this scope.`)
    }

    //
    return this.services.Scope.updateCollaborator(
      selectedScope._id,
      collaborator.id,
      collaborator.type,
    )
  }

  /**
   * Remove collaborator from the scope
   */
  async removeCollaboratorFromScope(
    tokenId: TokenId,
    scopeId: ScopeId,
    collaboratorId: UserId,
  ) {
    //
    const currentUser = await this.verifyTokenOfUser(
      tokenId,
      UserAccessTokenTypes.fullAccess,
    )

    //
    const selectedScope = await this.verifyCollaboratorOfScope(
      scopeId,
      currentUser._id,
      CollaboratorTypes.maintainer,
    )

    //
    return this.services.Scope.removeCollaborator(
      selectedScope._id,
      collaboratorId,
    )
  }

  /**
   * Fetch compose
   */
  async fetchCompose(composeId: ComposeId) {
    let setCache: SetComposeCacheFactoryFn | undefined

    if (this.cacheResolver) {
      const { data: cached, factory } = await this.cacheResolver.lookupCompose(
        composeId,
      )

      //
      if (cached) {
        return cached
      }

      setCache = factory
    }

    //
    const selectedCompose = await this.getCompose(composeId, {
      name: 1,
      modules: 1,
    })
    if (!selectedCompose) {
      throw new Error(`Could not find compose ${composeId}.`)
    }

    //
    const moduleIds = (selectedCompose?.modules || []).map((item) => item.id)
    const modules = await this.getModules(moduleIds, {
      _id: 1,
      tags: 1,
      versions: 1,
    })

    //
    const warnings: any[] = []
    const parsedModules = {}

    //
    for (const item of selectedCompose.modules) {
      try {
        parsedModules[item.id] = getModuleAllowsOnly(item, modules)
      } catch (error) {
        warnings.push({
          id: item.id,
          version: item.version,
          code: 'MODULE_PARSE_ERROR',
          message: error.message,
        })
      }
    }

    const data = { modules: parsedModules, warnings }

    //
    if (setCache) {
      await setCache(data, moduleIds)
    }

    return data
  }

  /**
   * Fetch module
   */
  async fetchModule(id: string) {
    const { module: moduleId, version } = moduleIdHelpers.parser(id)

    //
    if (!validator.moduleId(moduleId)) {
      throw new Error(`Module id ${moduleId} is invalid.`)
    }

    //
    if (
      !versionHelpers.checkIsValid(version) &&
      version !== MODULE_LATEST_TAG
    ) {
      throw new Error('Invalid module version.')
    }

    let setCache: SetModuleCacheFactoryFn | undefined

    if (this.cacheResolver) {
      const { data: cached, factory } = await this.cacheResolver.lookupModule(
        id,
      )

      //
      if (cached) {
        return cached
      }

      setCache = factory
    }

    //
    const selectedModule = await this.getModule(moduleId, {
      name: 1,
      tags: 1,
      versions: 1,
    })
    if (!selectedModule) {
      throw new Error(`Module id ${moduleId} is not found.`)
    }

    const data = getModuleAllowsOnly({ id: moduleId, version }, [
      selectedModule,
    ])

    //
    if (setCache) {
      await setCache(data)
    }

    return data
  }

  /**
   * Get server config
   */
  async getConfig() {
    return {
      cdn: this.cdn,
      storageType: this.storageType,
    }
  }
}

export default Worker
