// tslint:disable: prettier

import { DEPENDENCIES_KEY, GLBOALS_KEY } from '@nuz/shared'

import { RuntimePlatforms } from '../types/common'

class Globals {
  private _globals: Window | typeof globalThis

  constructor(private readonly platform: RuntimePlatforms) {
    const isNode = this.platform === RuntimePlatforms.node
    const isExisted = !!(global as any)[GLBOALS_KEY]
    if (isNode && !isExisted) {
      // Create a key in global to prevent leaking memory and side effects
      (global as any)[GLBOALS_KEY] = {}
    }

    this._globals = isNode ? (global as any)[GLBOALS_KEY] : window

    // Clone dependencies store from global this
    if (!(this._globals as any)[DEPENDENCIES_KEY]) {
      (this._globals as any)[DEPENDENCIES_KEY] = Object.create(this._globals)
    }
  }

  get() {
    return this._globals
  }

  set(key: any, value: any) {
    (this._globals as any)[key] = value
  }

  has(key: any) {
    return !!(this._globals as any)[key]
  }

  delete(key: any) {
    (this._globals as any)[key] = undefined
  }

  clear() {
    (this._globals as any) = undefined
  }

  getContext() {
    return (this._globals as any)[DEPENDENCIES_KEY]
  }

  getDependency(key: string) {
    return (this._globals as any)[DEPENDENCIES_KEY][key]
  }

  setDependency(key: string, value: any) {
    return ((this._globals as any)[DEPENDENCIES_KEY][key] = value)
  }

  hasDependency(key: string) {
    return !!(this._globals as any)[DEPENDENCIES_KEY][key]
  }

  deleteDependency(key: string) {
    return (this._globals as any)[DEPENDENCIES_KEY][key] = undefined
  }

  clearDependency() {
    return (this._globals as any)[DEPENDENCIES_KEY] = undefined
  }
}

export default Globals
