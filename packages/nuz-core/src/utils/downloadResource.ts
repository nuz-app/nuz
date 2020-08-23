import type LRUCache from 'lru-cache'

import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

export interface DownloadResourceConfiguration extends FetchOptions {
  resolver?: LRUCache<any, any>
}

async function downloadResource(
  url: string,
  _configuration: DownloadResourceConfiguration = {} as any,
  retries: number = 0,
): Promise<string> {
  const config = Object.assign(
    {
      cache: 'default',
    },
    _configuration,
  )

  if (config?.resolver?.has(url)) {
    return config.resolver.get(url)
  }

  let content
  try {
    const response = await fetchWithTimeout(url, config)
    if (!response.ok) {
      throw new Error(
        `The response returned was not valid to use, from ${JSON.stringify(
          url,
        )}`,
      )
    }

    content = await response.text()
  } catch (error) {
    if (retries > 0) {
      content = await downloadResource(url, config, retries - 1)
    } else {
      throw new Error(
        `Can't download the resource to use, message: ${error.message}.`,
      )
    }
  }

  if (config?.resolver) {
    config.resolver.set(url, content)
  }

  return content
}

export default downloadResource
