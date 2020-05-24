import './polyfill'

import './autoload'

export * from './types'

export { default as load } from './load'
export { default as resolve } from './resolve'
export { default as bootstrap, process } from './bootstrap'

export {
  default as reactHelpersFactory,
  default as reactIntegrate,
  ReactFactoryDependencies,
} from './factories/react'
export {
  default as nextHelpersFactory,
  default as nextIntegrate,
  NextFactoryConfig,
} from './factories/next'
