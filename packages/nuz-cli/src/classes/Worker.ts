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
}

export default Worker
