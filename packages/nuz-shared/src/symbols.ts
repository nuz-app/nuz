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

export const INIT_KEY = !symbolSupported
  ? '@nuz/module.initialized'
  : Symbol.for('@nuz/module.initialized')

export const REACT_DOM_INJECTED = !symbolSupported
  ? '@nuz/react.injected'
  : Symbol.for('@nuz/react.injected')

// Must be a string
export const DEPENDENCIES_KEY = '@nuz/core.dependencies'

export const SHARED_CONFIG_KEY = '@nuz/core.sharedConfig'
