import AbortController from 'abort-controller'

import appendQueryToUrl, {
  AppendQueryToUrlConfiguration,
} from './appendQueryToUrl'

export interface FetchOptions extends RequestInit {
  timeout?: number
  sourceMap?: boolean
}

const defaultOptions = {
  timeout: 60000,
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions,
): Promise<Response> {
  const { timeout, sourceMap, integrity, ...rest } = Object.assign(
    {},
    defaultOptions,
    options,
  )

  // Use controller to cancel request if it timed out
  const controller = new AbortController()
  const signal = controller.signal

  // Make a request
  const request = fetch(
    appendQueryToUrl(url, {
      sourceMap,
    } as AppendQueryToUrlConfiguration),
    Object.assign({ signal }, rest, !sourceMap && { integrity }),
  )

  return Promise.race([
    request,
    new Promise((_, reject) => {
      setTimeout(() => {
        // Abort thís request
        controller.abort()

        reject(
          new Error(
            'The request was canceled because the waiting time was too long!',
          ),
        )
      }, timeout)
    }) as any,
  ])
}

export default fetchWithTimeout
