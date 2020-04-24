import { UserAccessTokenTypes } from '@nuz/shared'
import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  static endpoint: string

  static async prepare(endpoint: string) {
    this.endpoint = endpoint
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
    return this.deleteTokenFromUser(id, token)
  }

  static async createTokenForUser(
    token: string,
    requiredType: UserAccessTokenTypes,
  ) {
    return got(
      Object.assign(apiUrls.createTokenForUser(this.endpoint), {
        data: { token, type: requiredType },
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

  /**
   * Add a collaborator to the scope
   */
  static async addCollaboratorToScope(
    token: string,
    scope: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.addCollaboratorToScope(this.endpoint), {
        data: { token, scope, collaborator },
      }),
    )
  }

  /**
   * Update a collaborator of the scope
   */
  static async updateCollaboratorOfScope(
    token: string,
    scope: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.updateCollaboratorOfScope(this.endpoint), {
        data: { token, scope, collaborator },
      }),
    )
  }

  /**
   * Remove a collaborator from the scope
   */
  static async removeCollaboratorFromScope(
    token: string,
    scope: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(apiUrls.removeCollaboratorFromScope(this.endpoint), {
        data: { token, scope, collaboratorId: collaborator },
      }),
    )
  }

  /**
   * Add a collaborator to the module
   */
  static async addCollaboratorToModule(
    token: string,
    module: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.addCollaboratorToModule(this.endpoint), {
        data: { token, module, collaborator },
      }),
    )
  }

  /**
   * Update a collaborator of the module
   */
  static async updateCollaboratorOfModule(
    token: string,
    module: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.updateCollaboratorOfModule(this.endpoint), {
        data: { token, module, collaborator },
      }),
    )
  }

  /**
   * Remove a collaborator from the module
   */
  static async removeCollaboratorFromModule(
    token: string,
    module: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(apiUrls.removeCollaboratorFromModule(this.endpoint), {
        data: { token, module, collaboratorId: collaborator },
      }),
    )
  }

  /**
   * Add a collaborator to the composition
   */
  static async addCollaboratorToComposition(
    token: string,
    composition: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.addCollaboratorToComposition(this.endpoint), {
        data: { token, composition, collaborator },
      }),
    )
  }

  /**
   * Update a collaborator of the composition
   */
  static async updateCollaboratorOfComposition(
    token: string,
    composition: string,
    collaborator: any,
  ) {
    return got(
      Object.assign(apiUrls.updateCollaboratorOfComposition(this.endpoint), {
        data: { token, composition, collaborator },
      }),
    )
  }

  /**
   * Remove a collaborator from the composition
   */
  static async removeCollaboratorFromComposition(
    token: string,
    composition: string,
    collaborator: string,
  ) {
    return got(
      Object.assign(apiUrls.removeCollaboratorFromComposition(this.endpoint), {
        data: { token, composition, collaboratorId: collaborator },
      }),
    )
  }
}

export default Worker
