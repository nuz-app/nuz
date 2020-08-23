import fetchWithTimeout, { FetchOptions } from './fetchWithTimeout'

async function fetchConfig<T extends unknown>(
  url: string,
  _configuration: FetchOptions = {},
  retries: number = 0,
): Promise<T> {
  const config = Object.assign(
    {
      cache: 'default',
      headers: { 'content-type': 'application/json' },
    },
    _configuration,
  )

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

    content = await response.json()
  } catch (error) {
    if (retries > 0) {
      content = await fetchConfig(url, config, retries - 1)
    } else {
      throw new Error(
        `Can't download the resource to use, message: ${error.message}.`,
      )
    }
  }

  return content
}

export default fetchConfig
