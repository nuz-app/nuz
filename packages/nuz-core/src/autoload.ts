import { ROOT_KEY } from '@nuz/shared'

import * as environment from './environment'
import * as selfHelpers from './utils/selfHelpers'

// tslint:disable-next-line: prettier
;(function autoload() {
  if (!selfHelpers.has(ROOT_KEY)) {
    selfHelpers.set(ROOT_KEY, { version: environment.VERSION })
  }
})()
