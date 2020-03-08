import { ROOT as ROOT_KEY } from './lib/symbols'

import * as selfHelpers from './utils/selfHelpers'

// tslint:disable-next-line: prettier
(function autoload() {
  if (!selfHelpers.has(ROOT_KEY)) {
    selfHelpers.set(ROOT_KEY, { version: null })
  }
})()
