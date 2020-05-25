import './polyfill'

import './autoload'

export * from './types'

export { default as load } from './load'
export { default as require } from './require'
export { default as bootstrap, process } from './bootstrap'

export {
  integrate as reactHelpersFactory,
  integrate as reactIntegrate,
  ReactFactoryDependencies,
} from './factories/react'
export {
  default as nextHelpersFactory,
  default as nextIntegrate,
  NextFactoryConfig,
} from './factories/next'
