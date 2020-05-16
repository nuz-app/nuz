import ensureOriginSlash from './ensureOriginSlash'

export const parse = (pathname: string) => {
  const paths = pathname.split('/-/')
  if (!paths[1]) {
    throw new Error('URL is invalid')
  }

  const moduleId = paths[0].replace(/^\//, '')
  // @ts-ignore
  const [, version, file] = paths[1].match(/^([^\/]+)\/([\s\S]+)$/i)

  return {
    pathname,
    paths,
    moduleId,
    version,
    file,
  }
}

export const create = (
  moduleId: string,
  version: string,
  file: string,
  origin: string,
) => `${origin}/${moduleId}/-/${version}/${file}`

export const createOrigin = (
  moduleId: string,
  version: string,
  origin: string,
) => `${ensureOriginSlash(origin)}${moduleId}/-/${version}/`

export const key = (moduleId: string, version: string, file: string) =>
  `${moduleId}/${version}/${file}`
