import { Document, Model } from 'mongoose'

import { Collaborator, ModuleFormats, Resource, TObjectId } from './common'

export type CompositionId = string
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

export type RequiredModule = {
  id: ModuleId
  version: string
}

/**
 * Module
 */

export interface ModuleModel {
  name: string
  collaborators: Collaborator[]
  tags: Map<string, string>
  versions: Map<string, VersionInfo>
  schedule?: Schedule
}

export interface ModuleDocument extends Document, ModuleModel {
  _id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * User
 */

export enum UserAccessTokenTypes {
  readOnly = 'readOnly',
  publish = 'publish',
  fullAccess = 'fullAccess',
}

export interface UserAccessToken {
  value: TokenId
  type: UserAccessTokenTypes
  createdAt: Date
}

export interface UserModel {
  name: string
  email: string
  username: string
  password: string
  accessTokens: UserAccessToken[]
}

export interface UserDocument extends Document, UserModel {
  _id: TObjectId
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => boolean
}

/**
 * Composition
 */
export interface CompositionModel {
  name: string
  collaborators: Collaborator[]
  modules: RequiredModule[]
}

export interface CompositionDocument extends Document, CompositionModel {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface Models {
  User: Model<UserDocument>
  Module: Model<ModuleDocument>
  Composition: Model<CompositionDocument>
}
