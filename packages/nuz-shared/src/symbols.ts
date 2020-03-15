const symbolSupported = typeof Symbol === 'function' && Symbol.for

export const GLBOALS_KEY = !symbolSupported
  ? '@nuz/core.globals'
  : Symbol.for('@nuz/core.globals')

export const CONFIG_KEY = !symbolSupported
  ? '@nuz/core.config'
  : Symbol.for('@nuz/core.config')

export const MODULES_KEY = !symbolSupported
  ? '@nuz/core.modules'
  : Symbol.for('@nuz/core.modules')

export const ROOT_KEY = !symbolSupported
  ? '@nuz/core.root'
  : Symbol.for('@nuz/core.root')
