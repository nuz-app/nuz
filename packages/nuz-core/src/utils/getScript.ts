import LRUCache from 'lru-cache'

import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

export interface GetScriptConfig extends FetchOptions {
  resolver?: LRUCache<any, any>
}

const defaultConfig = {
  cache: 'default',
}

const getScript = async (
  url: string,
  config: GetScriptConfig = {} as any,
  retries: number = 0,
): Promise<string> => {
  const mergedConfig = Object.assign({}, defaultConfig, config)

  if (mergedConfig?.resolver?.has(url)) {
    return mergedConfig.resolver.get(url)
  }

  let content
  try {
    const response = await fetchWithTimeout(url, mergedConfig)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    content = await response.text()
  } catch (error) {
    if (retries > 0) {
      content = await getScript(url, mergedConfig, retries - 1)
    } else {
      throw new Error(
        `Cannot get script from ${url}, details: ${error.message || error}`,
      )
    }
  }

  if (mergedConfig?.resolver) {
    mergedConfig.resolver.set(url, content)
  }

  return content
}

export default getScript
