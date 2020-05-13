import { qs } from '@nuz/utils'

export interface AppendConfig {
  sourceMap: boolean
}

function appendQueryToUrl(value: string, config: AppendConfig) {
  const { sourceMap } = config

  if (!sourceMap) {
    return value
  }

  try {
    const url = new URL(value)
    url.search = Object.assign(qs.parse(url.search) || {}, {
      sourceMap,
    })
    return url.href
  } catch {
    return value
  }
}

export default appendQueryToUrl
