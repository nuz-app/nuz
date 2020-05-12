import AbortController from 'abort-controller'

export interface FetchOptions extends RequestInit {
  timeout?: number
  dev?: boolean
  sourceMap?: boolean
}

const fetchWithTimeout = (
  url: string,
  { timeout, dev, sourceMap, ...rest }: FetchOptions = {},
): Promise<Response> => {
  const timeoutIsEmpty = !timeout || timeout < 0
  if (timeoutIsEmpty) {
    return fetch(url, Object.assign({}, rest))
  }

  const controller = new AbortController()
  const signal = controller.signal

  return Promise.race([
    fetch(
      url,
      Object.assign({}, rest, {
        signal,
        headers: Object.assign(
          {},
          rest.headers,
          dev && { 'x-nuz-dev': 1 },
          sourceMap && { 'x-nuz-sourcemap': 1 },
        ),
      }),
    ),
    new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort()
        reject(new Error(`Fetch to ${url} is timedout!`))
      }, timeout)
    }) as any,
  ])
}

export default fetchWithTimeout
