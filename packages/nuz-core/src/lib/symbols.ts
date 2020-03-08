const symbolSupported = typeof Symbol === 'function' && Symbol.for
// const symbolSupported = false

export const GLBOALS = !symbolSupported
  ? '@nuz/core.globals'
  : Symbol.for('@nuz/core.globals')

export const CONFIG = !symbolSupported
  ? '@nuz/core.config'
  : Symbol.for('@nuz/core.config')

export const MODULES = !symbolSupported
  ? '@nuz/core.modules'
  : Symbol.for('@nuz/core.modules')

export const ROOT = !symbolSupported
  ? '@nuz/core.root'
  : Symbol.for('@nuz/core.root')
