/**
 * Check is a object-like
 */
const checkIsObject = (value: any) =>
  !!(value && typeof value === 'object' && !Array.isArray(value))

export default checkIsObject
