import { INIT_KEY } from '@nuz/shared'

import * as selfHelpers from './selfHelpers'

export const mark = () => selfHelpers.set(INIT_KEY, true)

export default () => selfHelpers.has(INIT_KEY)
