import ensureOriginSlash from './ensureOriginSlash'
import * as validator from './validator'
import * as versionHelpers from './versionHelpers'

export const parse = (pathname: string) => {
  const paths = (pathname || '').split('/-/')
  if (!paths[1]) {
    throw new Error('URL is invalid')
  }

  const moduleId = paths[0].replace(/^\//, '')
  const [, version, file] = paths[1].match(/^([^\/]+)\/([\s\S]+)$/i) || []

  if (!versionHelpers.checkIsValid(version)) {
    throw new Error(`Version is invalid, value ${version}`)
  }

  if (!validator.moduleId(moduleId)) {
    throw new Error(`Module is invalid, value ${moduleId}`)
  }

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
) => {
  if (!versionHelpers.checkIsValid(version)) {
    throw new Error(`Version is invalid, value ${version}`)
  }

  if (!validator.moduleId(moduleId)) {
    throw new Error(`Module is invalid, value ${moduleId}`)
  }

  return `${origin}/${moduleId}/-/${version}/${file}`
}

export const createOrigin = (
  moduleId: string,
  version: string,
  origin: string,
) => {
  if (!versionHelpers.checkIsValid(version)) {
    throw new Error(`Version is invalid, value ${version}`)
  }

  if (!validator.moduleId(moduleId)) {
    throw new Error(`Module is invalid, value ${moduleId}`)
  }

  return `${ensureOriginSlash(origin)}${moduleId}/-/${version}/`
}

export const key = (moduleId: string, version: string, file: string) =>
  `${moduleId}/${version}/${file}`
