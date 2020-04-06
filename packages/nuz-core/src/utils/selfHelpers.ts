export const get = () =>
  (typeof self !== 'undefined' && self) ||
  (typeof window !== 'undefined' ? window : global)

export const set = (key: any, value: any) => ((get() as any)[key] = value)

export const has = (key: any) => !!(get() as any)[key]
