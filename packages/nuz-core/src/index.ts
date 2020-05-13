import './polyfill'

import './autoload'

export * from './types'

export { default as load } from './load'
export { default as resolve } from './resolve'
export { default as bootstrap } from './bootstrap'

export { default as getTagsInHead } from './getTagsInHead'
export { wait as checkIsReady } from './waitToReady'

export {
  default as reactHelpersFactory,
  ReactHelpersFactoryOptions,
  ReactHelpersConfig,
} from './reactHelpersFactory'
export {
  default as nextHelpersFactory,
  NextHelpersConfig,
} from './nextHelpersFactory'
