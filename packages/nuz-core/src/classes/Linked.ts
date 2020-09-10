import { LINKED_CHANGE_EVENT, LINKED_DEFINE_EVENT } from '@nuz/shared'
import { DeferedPromise, deferedPromise, internalUrlsCreators } from '@nuz/utils'

import { LinkedConfig, ModulesConfig } from '../types'
import createSocketConnection from '../utils/createSocketConnection'

class Linked {
  private readonly socket: SocketIOClient.Socket | undefined
  private readonly modulesWatching: string[]
  private internalModules: ModulesConfig

  constructor(private readonly linked: LinkedConfig) {
    const { port } = this.linked || {}

    const isUnused = !this.linked || !port
    const watchUrl = !isUnused && internalUrlsCreators.watch(port as any)

    // Create connection and save io and get linked watch info
    this.socket = !watchUrl ? undefined : createSocketConnection(watchUrl)

    // Create empty modules watching list
    this.modulesWatching = []

    // Create empty modules list
    this.internalModules = {}
  }

  private async waitConnect() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return resolve(true)
      }

      this.socket.on('connect', (error: Error) => {
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
    if (!this.socket) {
      dfPromise.resolve(true)
      return
    }

    // Bind event on `define`, received modules as linked modules
    this.socket.on(LINKED_DEFINE_EVENT, ({ modules: linkedModules }: any) => {
      this.internalModules = linkedModules || {}
      dfPromise.resolve(true)
    })

    // Bind event on `change`, received modules as changed modules
    this.socket.on(LINKED_CHANGE_EVENT, ({ changes: changedModules }: any) => {
      const includingModulesChanged = changedModules.some((name: any) =>
        this.modulesWatching.includes(name),
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
    return this.internalModules
  }

  exists(id: string): boolean {
    return !!this.internalModules[id]
  }

  watch(ids: string[]) {
    this.modulesWatching.push(...ids)
  }

  // tslint:disable-next-line: no-empty
  unwatch(ids: string[]) {}
}

export default Linked
