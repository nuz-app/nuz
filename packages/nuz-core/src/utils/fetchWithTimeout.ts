import AbortController from 'abort-controller'

import appendQueryToUrl, { AppendConfig } from './appendQueryToUrl'

export interface FetchOptions extends RequestInit {
  timeout?: number
  sourceMap?: boolean
}

async function fetchWithTimeout(
  url: string,
  { timeout, sourceMap, ...rest }: FetchOptions = {},
): Promise<Response> {
  const isNotUseTimeout = !timeout || timeout < 0
  const updatedUrl = appendQueryToUrl(url, { sourceMap } as AppendConfig)

  if (isNotUseTimeout) {
    return fetch(updatedUrl, Object.assign({}, rest))
  }

  const controller = new AbortController()
  const signal = controller.signal

  return Promise.race([
    fetch(
      updatedUrl,
      Object.assign({}, rest, {
        signal,
        headers: Object.assign({}, rest.headers),
      }),
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
