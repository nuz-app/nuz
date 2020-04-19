import { Types } from 'mongoose'

export enum ModuleFormats {
  umd = 'umd',
}

export interface Resource {
  url: string
  integrity: string
}

export enum CollaboratorTypes {
  creator = 'creator',
  maintainer = 'maintainer',
  contributor = 'contributor',
}

export interface Collaborator {
  id: Types.ObjectId
  type: CollaboratorTypes
}

export type TObjectId = Types.ObjectId

export type CompositionId = string
export type ScopeId = string
export type ModuleId = string
export type UserId = TObjectId
export type TokenId = string

// tslint:disable-next-line: no-empty-interface
export interface Schedule {}

export type VersionInfo = {
  version: string
  library: string
  publisher: string
  createdAt: Date
  format: ModuleFormats
  resolve: {
    main: Resource
    styles: Resource[]
  }
  exportsOnly?: string[]
  alias?: { [key: string]: string }
  fallback?: string
  deprecated?: string
}

export type RequiredModule = { id: string; version: string }
