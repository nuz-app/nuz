import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  static endpoint: string

  static async prepare(endpoint: string) {
    this.endpoint = endpoint
  }

  static async login(username: string, password: string, required: any) {
    return got(
      Object.assign(apiUrls.login(this.endpoint), {
        data: { username, password, type: required },
      }),
    )
  }
}

export default Worker
