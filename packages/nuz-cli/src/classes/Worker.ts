import { UserAccessTokenTypes } from '@nuz/shared'
import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  static endpoint: string

  static async prepare(endpoint: string) {
    this.endpoint = endpoint
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
}

export default Worker
