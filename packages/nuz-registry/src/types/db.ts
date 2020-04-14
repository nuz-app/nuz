import { Document, Model } from 'mongoose'

import { Collaborator, ModuleFormats, Resource, TObjectId } from './common'

// tslint:disable-next-line: no-empty-interface
export interface Schedule {}

export type VersionInfo = {
  version: string
  library: string
  alias?: { [key: string]: string }
  exportsOnly?: string[]
  format?: ModuleFormats
  publisher: string
  createdAt: Date
  resolve: {
    main: Resource
    styles: Resource[]
  }
  deprecated?: string
}

/**
 * Module
 */

export interface ModuleModel {
  name: string
  tags: {
    upstream: string
    fallback: string
  }
  collaborators: Collaborator[]
  versions: Map<string, VersionInfo>
  schedule?: Schedule
}

export interface ModuleDocument extends Document, ModuleModel {
  _id: TObjectId
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
  value: string
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
 * Group
 */
export interface CompositionModel {
  name: string
  collaborators: Collaborator[]
  modules: string[]
}

export interface CompositionDocument extends Document, CompositionModel {
  _id: TObjectId
  createdAt: Date
  updatedAt: Date
}

export interface Models {
  User: Model<UserDocument>
  Module: Model<ModuleDocument>
  Composition: Model<CompositionDocument>
}
