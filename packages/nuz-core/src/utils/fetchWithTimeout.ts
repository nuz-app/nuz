import AbortController from 'abort-controller'

export interface FetchOptions extends RequestInit {
  timeout?: number
}

const fetchWithTimeout = (
  url: string,
  { timeout, ...rest }: FetchOptions = {},
): Promise<Response> => {
  const timeoutIsEmpty = !timeout || timeout < 0
  if (timeoutIsEmpty) {
    return fetch(url, Object.assign({}, rest))
  }

  const controller = new AbortController()
  const signal = controller.signal

  return Promise.race([
    fetch(url, Object.assign({}, rest, { signal })),
    new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort()
        reject(new Error(`Fetch to ${url} is timedout!`))
      }, timeout)
    }) as any,
  ])
}

export default fetchWithTimeout
