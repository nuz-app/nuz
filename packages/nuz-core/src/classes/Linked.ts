import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { deferedPromise, DeferedPromise, linkedUrls } from '@nuz/utils'
import io from 'socket.io-client'

import { LinkedConfig, ModulesConfig } from '../types'

import fetchWithTimeout from '../utils/fetchWithTimeout'

const createSocket = (url: URL) =>
  io.connect(url.host, {
    path: url.pathname,
  })

class Linked {
  private readonly _socket: SocketIOClient.Socket
  private readonly _watching: string[]
  private _modules: ModulesConfig

  constructor(private readonly linked: LinkedConfig) {
    const { port } = this.linked

    const watchUrl = linkedUrls.watch(port)
    console.log({ watchUrl })

    // Create connection and save io and get linked watch info
    this._socket = createSocket(watchUrl)

    console.log(this._socket, 'this._socket')

    // Create empty watching list
    this._watching = []
  }

  private async waitConnect() {
    return new Promise((resolve, reject) => {
      this._socket.on('connect', error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  private reload() {
    window.location.reload()
  }

  private bindEvents(dfPromise: DeferedPromise) {
    // Bind event on `define`, received modules as linked modules
    this._socket.on(
      LINKED_DEFINE_EVENT,
      ({ ready, modules: linkedModules }) => {
        console.log({ ready, linkedModules })
        this._modules = linkedModules

        // Waiting until bundles is ready
        if (ready) {
          dfPromise.resolve(true)
        }
      },
    )

    // Bind event on `change`, received modules as changed modules
    this._socket.on(LINKED_CHANGE_EVENT, ({ modules: changedModules }) => {
      const includingModulesChanged = changedModules.some(name =>
        this._watching.includes(name),
      )
      if (includingModulesChanged) {
        this.reload()
      }
    })
  }

  async prepare() {
    const dfPromise = deferedPromise()
    this.bindEvents(dfPromise)

    const connectPromise = this.waitConnect()
    console.log('done!!')

    return await Promise.all([dfPromise, connectPromise])
  }

  getModules(): ModulesConfig {
    return this._modules
  }

  exists(name: string): boolean {
    return !!this._modules[name]
  }

  watch(modules: string[]) {
    this._watching.push(...modules)
  }

  unwatch(modules: string[]) {}
}

export default Linked
