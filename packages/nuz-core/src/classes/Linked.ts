import { linkedUrls } from '@nuz/utils'

import { BootstrapConfig } from '../types'

import fetchWithTimeout from '../utils/fetchWithTimeout'

class Linked {
  private readonly url: string

  constructor(private readonly linked: BootstrapConfig['linked']) {
    if (!this.linked) {
      return
    }

    this.url = linkedUrls.modules(this.linked.port)
  }

  async getScript(name: string) {
    const url = `${this.url}/${name}/index.js`

    const response = await fetchWithTimeout(url)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    const content = await response.text()
    return content
  }
}

export default Linked
