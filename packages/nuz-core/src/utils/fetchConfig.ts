import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

const defaultConfig = {
  cache: 'default',
  headers: { 'content-type': 'application/json' },
}

const fetchConfig = async <T = unknown>(
  url: string,
  config: FetchOptions = {},
  retries: number = 0,
): Promise<T> => {
  const mergedConfig = Object.assign({}, defaultConfig, config)

  let content
  try {
    const response = await fetchWithTimeout(url, mergedConfig)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    content = await response.json()
  } catch (error) {
    if (retries > 0) {
      content = await fetchConfig(url, config, retries - 1)
    } else {
      throw new Error(
        `Cannot get config from ${url}, details: ${error.message || error}`,
      )
    }
  }

  return content
}

export default fetchConfig
