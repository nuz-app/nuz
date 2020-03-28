import Globals from '../classes/Globals'

import {
  RuntimePlatforms,
  UpstreamConfigAllowed,
  UpstreamFullConfig,
  UpstreamHosts,
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
  domain: string | undefined,
  resource: string | UpstreamResolveResource,
): Resource => {
  const left =
    typeof resource === 'string'
      ? resource
      : !domain
      ? (resource as any).url
      : (resource as any).path
  const url = (!domain ? left : [domain, left].join('/')) as string

  return {
    url,
    integrity: (resource && (resource as any).integrity) as string | undefined,
  }
}

const resolveByDomain = (
  resolve: UpstreamFullConfig['resolve'],
  domain: string | undefined,
  isNode: boolean,
) => {
  const resolveUrls = { main: null as any, styles: [] as Resource[] }

  if (typeof resolve === 'string') {
    // For example: resolve is 'react' -> https://unpkg.com/react
    resolveUrls.main = ensureResolve(domain, resolve)
  } else {
    // @ts-ignore
    const { main, web, node, styles } = resolve as UpstreamResolveConfig

    const path = main || (isNode ? node : web)
    resolveUrls.main = ensureResolve(domain, path)

    if (styles) {
      resolveUrls.styles = styles
        .filter(Boolean)
        .map((style) => ensureResolve(domain, style))
    }
  }

  return resolveUrls
}

const HOSTS = {
  [UpstreamHosts.unpkg]: 'https://unpkg.com',
  [UpstreamHosts.self]: undefined,
}

export const parse = (
  config: UpstreamConfigAllowed,
  platform: RuntimePlatforms,
) => {
  const isNode = platform === RuntimePlatforms.node
  const resolveUrls = {
    main: undefined as any,
    styles: [] as Resource[],
  }

  if (!config) {
    return null
  }

  if (typeof config === 'string') {
    resolveUrls.main = { url: config, integrity: '' }
    return resolveUrls
  }

  const { host, resolve } = config as UpstreamFullConfig

  const domain = HOSTS[host]
  Object.assign(resolveUrls, resolveByDomain(resolve, domain, isNode))

  return resolveUrls
}
