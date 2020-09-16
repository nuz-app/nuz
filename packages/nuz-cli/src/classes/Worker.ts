import { UserAccessTokenTypes } from '@nuz/shared'
import { GotRequestConfig, got } from '@nuz/utils'
import FormData from 'form-data'
import fs from 'fs'

import * as apiUrls from '../utils/apiUrls'

interface WorkerConfig {
  token: string
  endpoint: string
}

class Worker {
  static endpoint: string
  static token: string

  static async prepare(endpoint: string, token: string): Promise<void> {
    this.set({
      endpoint,
      token,
    })
  }

  static set(config: Partial<WorkerConfig>): void {
    const { endpoint, token } = config

    if (typeof endpoint === 'string') {
      this.endpoint = endpoint
    }

    if (typeof token === 'string') {
      this.token = token
    }
  }

  static get(): WorkerConfig {
    return {
      token: this.token,
      endpoint: this.endpoint,
    }
  }

  static backup(): () => Promise<void> {
    const current = this.get()

    async function caller(this: typeof Worker) {
      this.set(current)
    }

    return caller.bind(this)
  }

  static async createUser({ name, email, username, password }) {
    return got(
      Object.assign(apiUrls.createUser(this.endpoint), {
        data: { data: { email, name, username, password } },
      }) as GotRequestConfig,
    )
  }

  static async loginAsUser(username: string, password: string) {
    return got(
      Object.assign(apiUrls.loginUser(this.endpoint), {
        data: { username, password },
      }) as GotRequestConfig,
    )
  }

  static async logoutFromUser(id: string, token: string) {
    return this.deleteTokenFromUser(id, this.token)
  }

  static async createTokenForUser(requiredType: UserAccessTokenTypes) {
    return got(
      Object.assign(apiUrls.createTokenForUser(this.endpoint, this.token), {
        data: { type: requiredType },
      }) as GotRequestConfig,
    )
  }

  static async deleteTokenFromUser(id: string, token: string) {
    return got(
      Object.assign(apiUrls.deleteTokenFromUser(this.endpoint), {
        data: { id, token },
      }) as GotRequestConfig,
    )
  }

  static async getAllComposeOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllComposeOfUser(this.endpoint), {
        params: { user },
      }) as GotRequestConfig,
    )
  }

  static async getAllScopesOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllScopesOfUser(this.endpoint), {
        params: { user },
      }) as GotRequestConfig,
    )
  }

  static async getAllModulesOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllModulesOfUser(this.endpoint), {
        params: { user },
      }) as GotRequestConfig,
    )
  }

  /**
   * Get a scope
   */
  static async getScope(scope: string, fields?: string[]) {
    return got(
      Object.assign(apiUrls.getScope(this.endpoint, this.token), {
        params: { scope, fields },
      }) as GotRequestConfig,
    )
  }

  /**
   * Create a scope
   */
  static async createScope(name: string) {
    return got(
      Object.assign(apiUrls.createScope(this.endpoint, this.token), {
        data: { data: { name } },
      }) as GotRequestConfig,
    )
  }

  /**
   * Delete a scope
   */
  static async deleteScope(scope: string) {
    return got(
      Object.assign(apiUrls.deleteScope(this.endpoint, this.token), {
        data: { scope },
      }) as GotRequestConfig,
    )
  }

  /**
   * Get all collaborators of the scope
   */
  static async getCollaboratorsOfScope(scope: string) {
    return got(
      Object.assign(
        apiUrls.getCollaboratorsOfScope(this.endpoint, this.token),
        {
          params: { scope },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Add a collaborator to the scope
   */
  static async addCollaboratorToScope(scope: string, collaborator: any) {
    return got(
      Object.assign(apiUrls.addCollaboratorToScope(this.endpoint, this.token), {
        data: { scope, collaborator },
      }) as GotRequestConfig,
    )
  }

  /**
   * Update a collaborator of the scope
   */
  static async updateCollaboratorOfScope(scope: string, collaborator: any) {
    return got(
      Object.assign(
        apiUrls.updateCollaboratorOfScope(this.endpoint, this.token),
        {
          data: { scope, collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Remove a collaborator from the scope
   */
  static async removeCollaboratorFromScope(
    scope: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(
        apiUrls.removeCollaboratorFromScope(this.endpoint, this.token),
        {
          data: { scope, collaboratorId: collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Get a module
   */
  static async getModule(module: string, fields?: string[]) {
    return got(
      Object.assign(apiUrls.getModule(this.endpoint, this.token), {
        params: { module, fields },
      }) as GotRequestConfig,
    )
  }

  /**
   * Publish version for the module
   */
  static async publishModule(
    id: string,
    data: any,
    files: fs.ReadStream[],
    options?: any,
  ) {
    const form = new FormData()
    files.forEach((file, idx) => form.append(`files`, file))
    form.append('module', id)
    form.append('data', JSON.stringify(data))
    form.append('options', JSON.stringify(options))

    const api = apiUrls.publishModule(this.endpoint, this.token)

    return got(
      Object.assign(api, {
        data: form,
        headers: Object.assign(form.getHeaders(), api.headers),
      }) as GotRequestConfig,
    )
  }

  /**
   * Set deprecate for the module
   */
  static async setDeprecateForModule(
    module: string,
    version: string,
    deprecate: string | undefined,
  ) {
    return got(
      Object.assign(apiUrls.setDeprecateForModule(this.endpoint, this.token), {
        data: { module, version, deprecate },
      }) as GotRequestConfig,
    )
  }

  /**
   * Get all collaborators of the module
   */
  static async getCollaboratorsOfModule(module: string) {
    return got(
      Object.assign(
        apiUrls.getCollaboratorsOfModule(this.endpoint, this.token),
        {
          params: { module },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Add a collaborator to the module
   */
  static async addCollaboratorToModule(module: string, collaborator: any) {
    return got(
      Object.assign(
        apiUrls.addCollaboratorToModule(this.endpoint, this.token),
        {
          data: { module, collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Update a collaborator of the module
   */
  static async updateCollaboratorOfModule(module: string, collaborator: any) {
    return got(
      Object.assign(
        apiUrls.updateCollaboratorOfModule(this.endpoint, this.token),
        {
          data: { module, collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Remove a collaborator from the module
   */
  static async removeCollaboratorFromModule(
    module: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(
        apiUrls.removeCollaboratorFromModule(this.endpoint, this.token),
        {
          data: { module, collaboratorId: collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Get a compose
   */
  static async getCompose(compose: string, fields?: string[]) {
    return got(
      Object.assign(apiUrls.getCompose(this.endpoint, this.token), {
        params: { compose, fields },
      }) as GotRequestConfig,
    )
  }

  /**
   * Create a compose
   */
  static async createCompose(name: string, modules?: { [id: string]: string }) {
    return got(
      Object.assign(apiUrls.createCompose(this.endpoint, this.token), {
        data: { data: { name, modules } },
      }) as GotRequestConfig,
    )
  }

  /**
   * Delete a compose
   */
  static async deleteCompose(compose: string) {
    return got(
      Object.assign(apiUrls.deleteCompose(this.endpoint, this.token), {
        data: { compose },
      }) as GotRequestConfig,
    )
  }

  /**
   * Get all collaborators of the compose
   */
  static async getCollaboratorsOfCompose(compose: string) {
    return got(
      Object.assign(
        apiUrls.getCollaboratorsOfCompose(this.endpoint, this.token),
        {
          params: { compose },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Add a collaborator to the compose
   */
  static async addCollaboratorToCompose(compose: string, collaborator: any) {
    return got(
      Object.assign(
        apiUrls.addCollaboratorToCompose(this.endpoint, this.token),
        {
          data: { compose, collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Update a collaborator of the compose
   */
  static async updateCollaboratorOfCompose(compose: string, collaborator: any) {
    return got(
      Object.assign(
        apiUrls.updateCollaboratorOfCompose(this.endpoint, this.token),
        {
          data: { compose, collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Remove a collaborator from the compose
   */
  static async removeCollaboratorFromCompose(
    compose: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(
        apiUrls.removeCollaboratorFromCompose(this.endpoint, this.token),
        {
          data: { compose, collaboratorId: collaborator },
        },
      ) as GotRequestConfig,
    )
  }

  /**
   * Set modules for the compose
   */
  static async setModulesForCompose(
    compose: string,
    modules: { [id: string]: string },
  ) {
    return got(
      Object.assign(apiUrls.setModulesForCompose(this.endpoint, this.token), {
        data: { compose, modules },
      }) as GotRequestConfig,
    )
  }

  /**
   * Remove modules from the compose
   */
  static async removeModulesForCompose(compose: string, moduleIds: string[]) {
    return got(
      Object.assign(
        apiUrls.removeModulesFromCompose(this.endpoint, this.token),
        {
          data: { compose, moduleIds },
        },
      ) as GotRequestConfig,
    )
  }
}

export default Worker
