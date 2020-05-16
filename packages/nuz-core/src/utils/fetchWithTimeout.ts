import AbortController from 'abort-controller'

import appendQueryToUrl, { AppendConfig } from './appendQueryToUrl'

export interface FetchOptions extends RequestInit {
  timeout?: number
  sourceMap?: boolean
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions,
): Promise<Response> {
  const { timeout, sourceMap, integrity, ...rest } = options || {}

  const isNotUseTimeout = !timeout || timeout < 0
  const updatedUrl = appendQueryToUrl(url, { sourceMap } as AppendConfig)

  if (isNotUseTimeout) {
    return fetch(
      updatedUrl,
      Object.assign({}, rest, !sourceMap && { integrity }),
    )
  }

  const controller = new AbortController()
  const signal = controller.signal

  return Promise.race([
    fetch(
      updatedUrl,
      Object.assign({ signal }, rest, !sourceMap && { integrity }),
    ),
    new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort()
        reject(new Error(`Fetch to ${url} is timed out!`))
      }, timeout)
    }) as any,
  ])
}

export default fetchWithTimeout
