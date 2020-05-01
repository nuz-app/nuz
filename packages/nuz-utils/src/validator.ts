export const name = (value: string) =>
  typeof value === 'string' && value.length >= 4 && value.length <= 32

export const USER_ID_REGEXP = /^([a-zA-Z0-9]{1}[a-zA-Z0-9\_\-]+[a-zA-Z0-9]{1})$/
export const username = (value: string) =>
  typeof value === 'string' &&
  USER_ID_REGEXP.test(value) &&
  value.length >= 6 &&
  value.length <= 24

export const email = (value: string) =>
  typeof value === 'string' &&
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)

export const password = (value: string) =>
  typeof value === 'string' && value.length >= 8

export const COMPOSITION_ID_REGEXP = /^([a-zA-Z0-9]{1}[a-zA-Z0-9\_\-]+[a-zA-Z0-9]{1})$/
export const compositionId = (value: string) =>
  typeof value === 'string' &&
  value.length >= 6 &&
  value.length <= 24 &&
  COMPOSITION_ID_REGEXP.test(value)

export const SCOPE_ID_REGEXP = /^([a-zA-Z0-9]{1}[a-zA-Z0-9\_\-]+[a-zA-Z0-9]{1})$/
export const scopeId = (value: string) =>
  typeof value === 'string' &&
  value.length >= 6 &&
  value.length <= 24 &&
  SCOPE_ID_REGEXP.test(value)

export const MODULE_ID_REGEXP = /^(\@([a-zA-Z]{1}[a-zA-Z0-9\.\-]+[a-zA-Z]{1})\/)?([a-zA-Z]{1}[a-zA-Z0-9\.\-]+)$/
export const moduleId = (value: string) =>
  typeof value === 'string' &&
  value.length >= 6 &&
  value.length <= 72 &&
  MODULE_ID_REGEXP.test(value)
