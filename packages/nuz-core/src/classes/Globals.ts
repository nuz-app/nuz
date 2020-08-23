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

  get(): any {
    return this.globals
  }

  set(key: any, value: any): any {
    (this.globals as any)[key] = value
  }

  has(key: any): boolean {
    return !!(this.globals as any)[key]
  }

  delete(key: any): any {
    (this.globals as any)[key] = undefined
  }

  clear(): any {
    (this.globals as any) = undefined
  }

  getContext(): any {
    return (this.globals as any)[DEPENDENCIES_KEY]
  }

  getDependency(key: string): any {
    return (this.globals as any)[DEPENDENCIES_KEY][key]
  }

  setDependency(key: string, value: any): any {
    return ((this.globals as any)[DEPENDENCIES_KEY][key] = value)
  }

  hasDependency(key: string): boolean {
    return !!(this.globals as any)[DEPENDENCIES_KEY][key]
  }

  deleteDependency(key: string): any{
    return (this.globals as any)[DEPENDENCIES_KEY][key] = undefined
  }

  clearDependency(): any {
    return (this.globals as any)[DEPENDENCIES_KEY] = undefined
  }
}

export default Globals
