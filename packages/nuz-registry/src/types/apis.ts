import {
  CollaboratorTypes,
  RequiredModules,
  TObjectId,
  VersionInfo,
} from './common'

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

export interface CreateCompositionData {
  name: string
  modules: RequiredModules
}

export interface AddCollaboratorData {
  id: TObjectId
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
  | 'fallback'
> & { name: string }
