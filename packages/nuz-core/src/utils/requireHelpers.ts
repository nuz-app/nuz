import Globals from '../classes/Globals'

import {
  RuntimePlatforms,
  UpstreamConfigAllowed,
  UpstreamResolveConfig,
  UpstreamResolveResource,
} from '../types'

export const local = (name: string, globals: Globals) => {
  // try {
  //   const moduleId = require.resolve(name)
  //   return require(moduleId)
  //   // tslint:disable-next-line: no-empty
  // } catch (error) {}

  try {
    return (globals.get() as any)[name]
    // tslint:disable-next-line: no-empty
  } catch (error) {}

  return null
}

type Resource = {
  url: string
  integrity: string | undefined
}

const ensureResolve = (
  resource: string | UpstreamResolveResource,
): Resource => ({
  url: typeof resource === 'string' ? resource : (resource as any)?.url,
  integrity: (resource as any)?.integrity as string | undefined,
})

const resolveByUrl = (resolve: string | UpstreamResolveConfig) => {
  const resolveUrls = { main: null as any, styles: [] as Resource[] }

  if (typeof resolve === 'string') {
    resolveUrls.main = ensureResolve(resolve)
  } else {
    const { main, styles } = resolve as UpstreamResolveConfig

    resolveUrls.main = ensureResolve(main)

    if (styles) {
      resolveUrls.styles = styles
        .filter(Boolean)
        .map((style) => ensureResolve(style))
    }
  }

  return resolveUrls
}

export const parse = (resolve: UpstreamConfigAllowed) => {
  const resolveUrls = {
    main: undefined as any,
    styles: [] as Resource[],
  }

  if (!resolve) {
    return null
  }

  if (typeof resolve === 'string') {
    resolveUrls.main = { url: resolve, integrity: undefined }
    return resolveUrls
  }

  Object.assign(resolveUrls, resolveByUrl(resolve))
  return resolveUrls
}
