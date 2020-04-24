import { CollaboratorTypes } from '@nuz/shared'
import { Types } from 'mongoose'

export { CollaboratorTypes } from '@nuz/shared'

export enum ModuleFormats {
  umd = 'umd',
}

export interface Resource {
  url: string
  integrity: string
}

export interface Collaborator {
  id: UserId
  type: CollaboratorTypes
}

export type TObjectId = Types.ObjectId

export type CompositionId = string
export type ScopeId = string
export type ModuleId = string
export type UserId = string
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
