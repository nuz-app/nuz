import { CollaboratorTypes } from '@nuz/shared'
import { Resource, UserId, VersionInfo } from './common'

export type ModuleAsObject = { [id: string]: string }

export interface CreateUserData {
  name: string
  email: string
  username: string
  password: string
}

export interface UpdateUserData {
  name: string
  email: string
  password: string
}

export interface CreateComposeData {
  name: string
  modules: ModuleAsObject
}

export interface CreateScopeData {
  name: string
}

export interface AddCollaboratorData {
  id: UserId
  type: CollaboratorTypes
}

export type PublishModuleData = Pick<
  VersionInfo,
  | 'version'
  | 'library'
  | 'format'
  | 'resolve'
  | 'exportsOnly'
  | 'alias'
  | 'sizes'
  | 'fallback'
  | 'details'
> & { name: string; scope?: string; files: Resource[] }
