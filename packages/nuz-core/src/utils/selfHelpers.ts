import { RuntimePlatforms } from '../types/common'

import getRuntimePlatform from './getRuntimePlatform'

export const get = () =>
  getRuntimePlatform() === RuntimePlatforms.node ? global : window

export const set = (key, value) => Object.defineProperty(get(), key, { value })

export const has = key => !!get()[key]
