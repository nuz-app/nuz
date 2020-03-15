import { CHANGE_EVENT } from '@nuz/shared'
import { checkIsUrlOk, linkedUrls } from '@nuz/utils'
import socket from 'socket.io-client'

import { BootstrapConfig } from '../types'

import fetchWithTimeout from '../utils/fetchWithTimeout'

class Linked {
  private readonly url: string
  private readonly io: SocketIOClient.Socket
  private readonly watching: string[]

  constructor(private readonly linked: BootstrapConfig['linked']) {
    if (!this.linked) {
      return
    }

    const { port } = this.linked

    // Set url for linked module
    this.url = linkedUrls.modules(port)

    // Create connection and save io and watch helper
    const watch = linkedUrls.watch(port)
    this.io = socket(watch.host, {
      path: watch.path,
    })

    // Create empty watching list
    this.watching = []

    // Listen change event from server
    this.io.on(CHANGE_EVENT, ({ modules }) => {
      const isChanged = modules.some(module => this.watching.includes(module))
      console.log({ modules, isChanged })
      if (isChanged) {
        window.location.reload()
      }
    })
  }

  private getUrl(name: string) {
    return `${this.url}/${name}/index.js`
  }

  async isOk(name: string) {
    const url = this.getUrl(name)

    const isOk = await checkIsUrlOk(url)
    return isOk
  }

  async getScript(name: string) {
    const url = this.getUrl(name)

    const response = await fetchWithTimeout(url)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    const content = await response.text()
    return content
  }

  watch(modules: string[]) {
    this.watching.push(...modules)
  }
}

export default Linked
