function getGlobal(this: any): any {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }

  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') {
    return self
  }

  if (typeof window !== 'undefined') {
    return window
  }

  if (typeof global !== 'undefined') {
    return global
  }

  // Note: this might still return the wrong result!
  if (typeof this !== 'undefined') {
    return this
  }

  throw new Error('Unable to locate global `this`')
}

export default getGlobal
