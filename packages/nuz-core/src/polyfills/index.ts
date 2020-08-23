import { RuntimePlatforms } from 'src/types'

import getCurrentPlatform from '../utils/getCurrentPlatform'

if (getCurrentPlatform() === RuntimePlatforms.node) {
  // tslint:disable-next-line: no-var-requires
  require('./node')
} else {
  // tslint:disable-next-line: no-var-requires
  require('./browser')
}
