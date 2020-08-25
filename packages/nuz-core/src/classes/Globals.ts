// tslint:disable: prettier

import { DEPENDENCIES_KEY, GLBOALS_KEY } from '@nuz/shared'

import { RuntimePlatforms } from '../types/common'

export interface GlobalsConfiguration {
  platform: RuntimePlatforms
  context: false | string
}

class Globals {
  private readonly config: GlobalsConfiguration

  private globals: Window | typeof globalThis

  constructor(_config: GlobalsConfiguration) {
    this.config = Object.assign({}, _config, {
      context: [undefined, null, '', true].includes(_config.context)
        ? DEPENDENCIES_KEY
        : _config.context,
    })

    const isNode = this.config.platform === RuntimePlatforms.node
    const isExisted = !!(global as any)[GLBOALS_KEY]
    if (isNode && !isExisted) {
      // Create a key in global to prevent leaking memory and side effects
      (global as any)[GLBOALS_KEY] = {}
    }

    // Create globals instance
    this.globals = isNode ? (global as any)[GLBOALS_KEY] : window

    // Create context in the globals
    this.createContext()
  }

  get(): Window | typeof globalThis {
    return this.globals
  }

  set(key: any, value: any): void {
    (this.globals as any)[key] = value
  }

  has(key: any): boolean {
    return !!(this.globals as any)[key]
  }

  delete(key: any): void {
    (this.globals as any)[key] = undefined
  }

  clear(): void {
    (this.globals as any) = undefined
  }

  createContext(): void {
    const { context } = this.config

    // Create new objects that inherit from global
    if (!this.getContext() && context) {
      (this.globals as any)[context] = Object.create(this.globals)
    }
  }

  getContext<C extends unknown>(): C {
    const { context } = this.config

    if (!context) {
      return this.globals as any
    }

    return (this.globals as any)[context]
  }

  installDependency(key: string, value: any): void {
    this.getContext<any>()[key] = value
  }
}

export default Globals
