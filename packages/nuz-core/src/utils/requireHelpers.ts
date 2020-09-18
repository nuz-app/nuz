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
  // try {
  //   return require(name)
  //   // tslint:disable-next-line: no-empty
  // } catch {}

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
  script: Resource
  styles: Resource[]
} {
  const resolveUrls = { script: null as any, styles: [] as Resource[] }

  if (typeof resolve === 'string') {
    resolveUrls.script = ensureUrlAndIntegrity(resolve)
  } else {
    const { script, styles } = resolve as UpstreamResolveConfig

    resolveUrls.script = ensureUrlAndIntegrity(script)

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
  script: Resource
  styles: Resource[]
} | null {
  const resolvedUrls = {
    script: undefined as any,
    styles: [] as Resource[],
  }

  if (!resolve) {
    return null
  }

  if (typeof resolve === 'string') {
    resolvedUrls.script = { url: resolve, integrity: undefined }
    return resolvedUrls
  }

  Object.assign(resolvedUrls, getResolvedUrls(resolve))

  return resolvedUrls
}
