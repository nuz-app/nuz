import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

const defaultConfig = {
  cache: 'default',
}

const getScript = async (
  url: string,
  config: FetchOptions = {},
  retries: number = 0,
): Promise<string> => {
  const mergedConfig = Object.assign({}, defaultConfig, config)

  let content
  try {
    const response = await fetchWithTimeout(url, mergedConfig)
    if (!response.ok) {
      throw new Error(`Response from ${url} is invalid, response: ${response}`)
    }

    content = await response.text()
  } catch (error) {
    if (retries > 0) {
      content = await getScript(url, config, retries - 1)
    } else {
      throw new Error(
        `Cannot get script from ${url}, details: ${error.message || error}`,
      )
    }
  }

  return content
}

export default getScript
