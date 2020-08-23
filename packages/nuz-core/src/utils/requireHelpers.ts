import Globals from '../classes/Globals'
import {
  UpstreamConfigAllowed,
  UpstreamResolveConfig,
  UpstreamResolveResource,
} from '../types'

type Resource = {
  url: string
  integrity: string | undefined
}

export function local(name: string, globals: Globals): any {
  return (globals.get() as any)[name]
}

function ensureUrlAndIntegrity(
  resource: string | UpstreamResolveResource,
): Resource {
  return {
    url: typeof resource === 'string' ? resource : (resource as any)?.url,
    integrity: (resource as any)?.integrity as string | undefined,
  }
}

function getResolvedUrls(
  resolve: string | UpstreamResolveConfig,
): {
  main: any
  styles: Resource[]
} {
  const resolveUrls = { main: null as any, styles: [] as Resource[] }

  if (typeof resolve === 'string') {
    resolveUrls.main = ensureUrlAndIntegrity(resolve)
  } else {
    const { main, styles } = resolve as UpstreamResolveConfig

    resolveUrls.main = ensureUrlAndIntegrity(main)

    if (styles) {
      resolveUrls.styles = styles
        .filter(Boolean)
        .map((style) => ensureUrlAndIntegrity(style))
    }
  }

  return resolveUrls
}

export function parse(
  resolve: UpstreamConfigAllowed,
): {
  main: any
  styles: Resource[]
} | null {
  const resolvedUrls = {
    main: undefined as any,
    styles: [] as Resource[],
  }

  if (!resolve) {
    return null
  }

  if (typeof resolve === 'string') {
    resolvedUrls.main = { url: resolve, integrity: undefined }
    return resolvedUrls
  }

  Object.assign(resolvedUrls, getResolvedUrls(resolve))

  return resolvedUrls
}
