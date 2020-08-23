import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { DeferedPromise, deferedPromise, linkedUrls } from '@nuz/utils'

import { LinkedConfig, ModulesConfig } from '../types'
import createSocketConnection from '../utils/createSocketConnection'

class Linked {
  private readonly _socket: SocketIOClient.Socket | undefined
  private readonly _watching: string[]
  private _modules: ModulesConfig

  constructor(private readonly linked: LinkedConfig) {
    const { port } = this.linked || {}

    const isUnused = !this.linked || !port
    const watchUrl = !isUnused && linkedUrls.watch(port as any)

    // Create connection and save io and get linked watch info
    this._socket = !watchUrl ? undefined : createSocketConnection(watchUrl)

    // Create empty watching list
    this._watching = []

    // Create empty modules list
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
    this._socket.on(LINKED_DEFINE_EVENT, ({ modules: linkedModules }: any) => {
      this._modules = linkedModules || {}
      dfPromise.resolve(true)
    })

    // Bind event on `change`, received modules as changed modules
    this._socket.on(LINKED_CHANGE_EVENT, ({ changes: changedModules }: any) => {
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

  exists(id: string): boolean {
    return !!this._modules[id]
  }

  watch(ids: string[]) {
    this._watching.push(...ids)
  }

  // tslint:disable-next-line: no-empty
  unwatch(ids: string[]) {}
}

export default Linked
