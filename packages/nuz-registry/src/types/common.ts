import { CollaboratorTypes, ModuleFormats } from '@nuz/shared'
import { Types } from 'mongoose'

export interface Resource {
  url: string
  path: string
  md5sum: string
  size: number
  integrity: string
}

export interface Collaborator {
  id: UserId
  type: CollaboratorTypes
}

export type TObjectId = Types.ObjectId

export type ComposeId = string
export type ScopeId = string
export type ModuleId = string
export type UserId = string
export type TokenId = string

// tslint:disable-next-line: no-empty-interface
export interface Schedule {}

export interface VersionSizes {
  total: number
  script: number
  styles: number
}

export interface DetailsRepository {
  type: string
  url: string
  directory: string
}

export interface DetailsBugs {
  url: string
}

export interface VersionDetails {
  description?: string
  readme?: string
  bugs?: Partial<DetailsRepository>
  repository?: Partial<DetailsRepository>
  license?: string
  homepage?: string
  keywords?: string[]
}

export type VersionInfo = {
  version: string
  publisher: string
  createdAt: Date
  format: ModuleFormats
  resolve: {
    script: Resource
    styles: Resource[]
  }
  files: Resource[]
  sizes: VersionSizes
  details?: VersionDetails
  library?: string
  exportsOnly?: string[]
  alias?: { [key: string]: string }
  fallback?: string
  deprecated?: string
  shared?: string[]
  externals?: string[]
}

export type RequiredModule = { id: string; version: string }

export enum StorageTypes {
  self = 'self',
  provided = 'provided',
  full = 'full',
}
