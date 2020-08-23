import { qs } from '@nuz/utils'

export interface AppendQueryToUrlConfiguration {
  sourceMap: boolean
}

function appendQueryToUrl(
  url: string,
  configuration: AppendQueryToUrlConfiguration,
): string {
  const { sourceMap } = configuration

  try {
    const parsed = new URL(url)
    parsed.search = qs.stringify(
      Object.assign(
        qs.parse(parsed.search, {
          ignoreQueryPrefix: true,
        }) || {},
        sourceMap && {
          sourceMap,
        },
      ),
    )

    return parsed.href
  } catch {
    return url
  }
}

export default appendQueryToUrl
