import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { deferedPromise, DeferedPromise, linkedUrls } from '@nuz/utils'
import io from 'socket.io-client'

import { LinkedConfig, ModulesConfig } from '../types'

const createSocket = (url: URL) =>
  io.connect(url.origin, {
    path: url.pathname,
  })

class Linked {
  private readonly _socket: SocketIOClient.Socket | undefined
  private readonly _watching: string[]
  private _modules: ModulesConfig

  constructor(private readonly linked: LinkedConfig) {
    const { port } = this.linked || {}

    const isUnused = !this.linked || !port

    const watchUrl = !isUnused && linkedUrls.watch(port as any)

    // Create connection and save io and get linked watch info
    this._socket = !watchUrl ? undefined : createSocket(watchUrl)

    // Create empty watching list
    this._watching = []

    this._modules = {}
  }

  private async waitConnect() {
    return new Promise((resolve, reject) => {
      if (!this._socket) {
        return resolve(true)
      }

      this._socket.on('connect', (error: Error) => {
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

  private async bindEvents(dfPromise: DeferedPromise<any>) {
    if (!this._socket) {
      dfPromise.resolve(true)
      return
    }

    // Bind event on `define`, received modules as linked modules
    this._socket.on(
      LINKED_DEFINE_EVENT,
      ({ ready, modules: linkedModules }: any) => {
        this._modules = linkedModules || {}

        // Waiting until bundles is ready
        if (ready) {
          dfPromise.resolve(true)
        }
      },
    )

    // Bind event on `change`, received modules as changed modules
    this._socket.on(LINKED_CHANGE_EVENT, ({ modules: changedModules }: any) => {
      const includingModulesChanged = changedModules.some((name: any) =>
        this._watching.includes(name),
      )
      if (includingModulesChanged) {
        this.reload()
      }
    })
  }

  async prepare() {
    const connectPromise = this.waitConnect()

    const dfPromise = deferedPromise()
    this.bindEvents(dfPromise)

    return await Promise.all([dfPromise.promise, connectPromise])
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

  // tslint:disable-next-line: no-empty
  unwatch(modules: string[]) {}
}

export default Linked
