import { ROOT_KEY } from '@nuz/shared'

import * as selfHelpers from './utils/selfHelpers'

// tslint:disable-next-line: prettier
(function autoload() {
  if (!selfHelpers.has(ROOT_KEY)) {
    selfHelpers.set(ROOT_KEY, { version: null })
  }
})()
