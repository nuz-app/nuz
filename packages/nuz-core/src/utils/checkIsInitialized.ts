const key = Symbol.for('@nuz/module.initialized')

export const mark = () => (this[key] = true)

export default () => !!this[key]
