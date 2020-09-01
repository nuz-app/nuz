import qs from 'qs'

export function compose(id: string, registry: string): string {
  return `${registry}/fetch/compose?${qs.stringify({ compose: id })}`
}

export function module(id: string, registry: string): string {
  return `${registry}/fetch/module?${qs.stringify({ id })}`
}
