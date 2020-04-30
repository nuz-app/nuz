import { UserAccessTokenTypes } from '@nuz/shared'
import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  static endpoint: string
  static token: string

  static async prepare(endpoint: string, token: string) {
    this.endpoint = endpoint
    this.token = token
  }

  static async createUser({ name, email, username, password }) {
    return got(
      Object.assign(apiUrls.createUser(this.endpoint), {
        data: { data: { email, name, username, password } },
      }),
    )
  }

  static async loginAsUser(username: string, password: string) {
    return got(
      Object.assign(apiUrls.loginUser(this.endpoint), {
        data: { username, password },
      }),
    )
  }

  static async logoutFromUser(id: string, token: string) {
    return this.deleteTokenFromUser(id, this.token)
  }

  static async createTokenForUser(requiredType: UserAccessTokenTypes) {
    return got(
      Object.assign(apiUrls.createTokenForUser(this.endpoint, this.token), {
        data: { type: requiredType },
      }),
    )
  }

  static async deleteTokenFromUser(id: string, token: string) {
    return got(
      Object.assign(apiUrls.deleteTokenFromUser(this.endpoint), {
        data: { id, token },
      }),
    )
  }

  static async getAllCompositionsOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllCompositionsOfUser(this.endpoint), {
        data: { user },
      }),
    )
  }

  static async getAllScopesOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllScopesOfUser(this.endpoint), {
        data: { user },
      }),
    )
  }

  static async getAllModulesOfUser(user: string) {
    return got(
      Object.assign(apiUrls.getAllModulesOfUser(this.endpoint), {
        data: { user },
      }),
    )
  }

  /**
   * Create a scope
   */
  static async createScope(name: string) {
    return got(
      Object.assign(apiUrls.createScope(this.endpoint, this.token), {
        data: { data: { name } },
      }),
    )
  }

  /**
   * Delete a scope
   */
  static async deleteScope(scope: string) {
    return got(
      Object.assign(apiUrls.deleteScope(this.endpoint, this.token), {
        data: { scope },
      }),
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
          data: { scope },
        },
      ),
    )
  }

  /**
   * Add a collaborator to the scope
   */
  static async addCollaboratorToScope(scope: string, collaborator: any) {
    return got(
      Object.assign(apiUrls.addCollaboratorToScope(this.endpoint, this.token), {
        data: { scope, collaborator },
      }),
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
      ),
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
      ),
    )
  }

  /**
   * Publish version for the module
   */
  static async publishModule(module: string, data: any, options?: any) {
    return got(
      Object.assign(apiUrls.publishModule(this.endpoint, this.token), {
        data: { module, data, options },
      }),
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
      }),
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
          data: { module },
        },
      ),
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
      ),
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
      ),
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
      ),
    )
  }

  /**
   * Create a composition
   */
  static async createComposition(
    name: string,
    modules?: { [id: string]: string },
  ) {
    return got(
      Object.assign(apiUrls.createComposition(this.endpoint, this.token), {
        data: { data: { name, modules } },
      }),
    )
  }

  /**
   * Delete a composition
   */
  static async deleteComposition(composition: string) {
    return got(
      Object.assign(apiUrls.deleteComposition(this.endpoint, this.token), {
        data: { composition },
      }),
    )
  }

  /**
   * Get all collaborators of the composition
   */
  static async getCollaboratorsOfComposition(composition: string) {
    return got(
      Object.assign(
        apiUrls.getCollaboratorsOfComposition(this.endpoint, this.token),
        {
          data: { composition },
        },
      ),
    )
  }

  /**
   * Add a collaborator to the composition
   */
  static async addCollaboratorToComposition(
    composition: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(
        apiUrls.addCollaboratorToComposition(this.endpoint, this.token),
        {
          data: { composition, collaborator },
        },
      ),
    )
  }

  /**
   * Update a collaborator of the composition
   */
  static async updateCollaboratorOfComposition(
    composition: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(
        apiUrls.updateCollaboratorOfComposition(this.endpoint, this.token),
        {
          data: { composition, collaborator },
        },
      ),
    )
  }

  /**
   * Remove a collaborator from the composition
   */
  static async removeCollaboratorFromComposition(
    composition: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(
        apiUrls.removeCollaboratorFromComposition(this.endpoint, this.token),
        {
          data: { composition, collaboratorId: collaborator },
        },
      ),
    )
  }

  /**
   * Set modules for the composition
   */
  static async setModulesForComposition(
    composition: string,
    modules: { [id: string]: string },
  ) {
    return got(
      Object.assign(
        apiUrls.setModulesForComposition(this.endpoint, this.token),
        {
          data: { composition, modules },
        },
      ),
    )
  }

  /**
   * Remove modules from the composition
   */
  static async removeModulesForComposition(
    composition: string,
    moduleIds: string[],
  ) {
    return got(
      Object.assign(
        apiUrls.removeModulesFromComposition(this.endpoint, this.token),
        {
          data: { composition, moduleIds },
        },
      ),
    )
  }
}

export default Worker