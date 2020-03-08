import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

const defaultConfig = {
  cache: 'default',
  headers: { 'content-type': 'application/json' },
}

const getUpstreamConfig = async <T = unknown>(
  url: string,
  config?: FetchOptions,
): Promise<T> => {
  const mergedConfig = Object.assign({}, defaultConfig, config)

  let result
  try {
    const response = await fetchWithTimeout(url, mergedConfig)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    result = await response.json()
  } catch (error) {
    throw new Error(
      `Cannot get config from ${url}, details: ${error.message || error}`,
    )
  }

  return result
}

export default getUpstreamConfig
