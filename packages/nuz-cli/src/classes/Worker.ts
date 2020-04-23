import { got } from '@nuz/utils'

import * as apiUrls from '../utils/apiUrls'

class Worker {
  constructor(private readonly endpoint: string) {}

  async login(username: string, password: string, required: any) {
    const request = got(
      Object.assign(apiUrls.login(this.endpoint), {
        data: { username, password, type: required },
      }),
    )
    return request
  }
}

export default Worker
