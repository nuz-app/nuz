import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  static endpoint: string

  static async prepare(endpoint: string) {
    this.endpoint = endpoint
  }

  static async login(username: string, password: string, required: any) {
    return got(
      Object.assign(apiUrls.createTokenForUser(this.endpoint), {
        data: { username, password, type: required },
      }),
    )
  }

  static async logout(id: string, token: string) {
    return got(
      Object.assign(apiUrls.deleteTokenFromUser(this.endpoint), {
        data: { id, token },
      }),
    )
  }
}

export default Worker
