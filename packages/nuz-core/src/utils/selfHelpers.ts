import getGlobal from './getGlobal'

export function get(): any {
  return getGlobal()
}

export function set(key: any, value: any): any {
  return ((get() as any)[key] = value)
}

export function has(key: any): boolean {
  return !!(get() as any)[key]
}
