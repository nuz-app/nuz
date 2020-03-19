// tslint:disable: prettier

import { DEPENDENCIES_KEY, GLBOALS_KEY } from '@nuz/shared'

import { RuntimePlatforms } from '../types/common'

class Globals {
  private globals: Window | typeof globalThis

  constructor(private readonly platform: RuntimePlatforms) {
    const isNode = this.platform === RuntimePlatforms.node
    const isExisted = !!(global as any)[GLBOALS_KEY]
    if (isNode && !isExisted) {
      // Create a key in global to prevent leaking memory and side effects
      (global as any)[GLBOALS_KEY] = {}
    }

    this.globals = isNode ? (global as any)[GLBOALS_KEY] : window

    // Clone dependencies store from global this
    if (!(this.globals as any)[DEPENDENCIES_KEY]) {
      (this.globals as any)[DEPENDENCIES_KEY] = Object.create(this.globals)
    }
  }

  get() {
    return this.globals
  }

  set(key: any, value: any) {
    (this.globals as any)[key] = value
  }

  has(key: any) {
    return !!(this.globals as any)[key]
  }

  clear() {
    (this.globals as any) = undefined
  }

  getContext() {
    return (this.globals as any)[DEPENDENCIES_KEY]
  }

  getDependency(key: string) {
    return (this.globals as any)[DEPENDENCIES_KEY][key]
  }

  setDependency(key: string, value: any) {
    return ((this.globals as any)[DEPENDENCIES_KEY][key] = value)
  }

  hasDependency(key: string) {
    return !!(this.globals as any)[DEPENDENCIES_KEY][key]
  }

  clearDependency(key: string) {
    return (this.globals as any)[DEPENDENCIES_KEY][key]
  }
}

export default Globals
