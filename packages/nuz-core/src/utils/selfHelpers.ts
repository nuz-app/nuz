export const get = () => (typeof self !== 'undefined' ? self : this)

export const set = (key, value) => Object.defineProperty(get(), key, { value })

export const has = key => !!get()[key]
