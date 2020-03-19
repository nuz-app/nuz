import * as selfHelpers from './selfHelpers'

const key = Symbol.for('@nuz/module.initialized')

export const mark = () => selfHelpers.set(key, true)

export default () => selfHelpers.has(key)
