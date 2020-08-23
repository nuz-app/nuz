import { RequiredModuleConfiguration } from '../types'

function getModuleId(module: RequiredModuleConfiguration): string {
  const { id, version, name } = module

  return id || `${name}${version ? `@${version}` : ''}`
}

export default getModuleId
