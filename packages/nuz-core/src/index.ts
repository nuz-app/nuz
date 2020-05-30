import './polyfill'

import './autoload'

import bootstrap from './bootstrap'
import * as exportsAll from './exports'
import * as shared from './shared'

export function load(idOrName: string) {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  return exportsAll.load(idOrName)
}

export function require(idOrName: string) {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  return exportsAll.require(idOrName)
}

export { bootstrap }
export {
  NextFactoryConfig,
  Loadable,
  nextHelpersFactory,
  nextIntegrate,
} from './exports'

export * from './types'
