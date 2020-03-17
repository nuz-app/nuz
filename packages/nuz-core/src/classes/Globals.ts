import { DEPENDENCIES_KEY, GLBOALS_KEY } from '@nuz/shared'

import { RuntimePlatforms } from '../types/common'

class Globals {
  private globals: Window | typeof globalThis

  constructor(private readonly platform: RuntimePlatforms) {
    const isNode = this.platform === RuntimePlatforms.node
    const isExisted = !!global[GLBOALS_KEY]
    if (isNode && !isExisted) {
      // Create a key in global to prevent leaking memory and side effects
      global[GLBOALS_KEY] = {}
    }

    this.globals = isNode ? global[GLBOALS_KEY] : window

    // Clone dependencies store from global this
    if (!this.globals[DEPENDENCIES_KEY]) {
      this.globals[DEPENDENCIES_KEY] = Object.create(this.globals)
    }
  }

  get() {
    return this.globals
  }

  set(key, value) {
    return (this.globals[key] = value)
  }

  has(key) {
    return !!this.globals[key]
  }

  clear() {
    this.globals = undefined
  }

  getContext() {
    return this.globals[DEPENDENCIES_KEY]
  }

  getDependency(key: string) {
    return this.globals[DEPENDENCIES_KEY][key]
  }

  setDependency(key: string, value) {
    return (this.globals[DEPENDENCIES_KEY][key] = value)
  }

  hasDependency(key: string) {
    return !!this.globals[DEPENDENCIES_KEY][key]
  }

  clearDependency(key: string) {
    return this.globals[DEPENDENCIES_KEY][key]
  }
}

export default Globals
