import qs from 'qs'

export const compose = (id: string, registry: string) =>
  `${registry}/fetch/compose?${qs.stringify({ compose: id })}`

export const module = (id: string, registry: string) =>
  `${registry}/fetch/module?${qs.stringify({ id })}`
