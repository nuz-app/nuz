const DENIED_REGEXP = /(([^a-zA-Z0-9]{2})|^([^a-zA-Z0-9]+)|([^a-zA-Z0-9]+)$)/

export function name(value: string): boolean {
  return typeof value === 'string' && value.length >= 4 && value.length <= 32
}

export const USER_ID_REGEXP = /([a-zA-Z0-9\-\_]+)$/

export function username(value: string): boolean {
  return (
    typeof value === 'string' &&
    USER_ID_REGEXP.test(value) &&
    !DENIED_REGEXP.test(value) &&
    value.length >= 4 &&
    value.length <= 24
  )
}

export function email(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  )
}

export function password(value: string): boolean {
  return typeof value === 'string' && value.length >= 8
}

export const COMPOSITION_ID_REGEXP = /([a-zA-Z0-9\-\_]+)$/

export function composeId(value: string): boolean {
  return (
    typeof value === 'string' &&
    value.length >= 4 &&
    value.length <= 24 &&
    COMPOSITION_ID_REGEXP.test(value) &&
    !DENIED_REGEXP.test(value)
  )
}

export const SCOPE_ID_REGEXP = /([a-zA-Z0-9\-\_]+)$/

export function scopeId(value: string): boolean {
  return (
    typeof value === 'string' &&
    value.length >= 4 &&
    value.length <= 24 &&
    SCOPE_ID_REGEXP.test(value) &&
    !DENIED_REGEXP.test(value)
  )
}

export const MODULE_ID_REGEXP = /^(\@([a-zA-Z]{1}[a-zA-Z0-9\-\_]+[a-zA-Z]{1})\/)?([a-zA-Z]{1}[a-zA-Z0-9\-\_]+[a-zA-Z0-9]{1})$/

export function moduleId(value: string): boolean {
  return (
    typeof value === 'string' &&
    value.length >= 6 &&
    value.length <= 72 &&
    MODULE_ID_REGEXP.test(value) &&
    !/([^a-zA-Z0-9]{2})/.test(value)
  )
}
