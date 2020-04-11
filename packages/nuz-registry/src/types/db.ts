import { Document, Model } from 'mongoose'

import { Collaborator, ModuleFormats, Resource } from './common'

// tslint:disable-next-line: no-empty-interface
export interface Schedule {}

export type VersionInfo = {
  version: string
  library: string
  alias?: { [key: string]: string }
  exportsOnly?: string[]
  format?: ModuleFormats
  createdAt: Date
  resolve: {
    main: Resource
    styles: Resource[]
  }
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
  _id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * User
 */

export enum UserAccessTokenTypes {}

export interface UserAccessToken {
  value: string
  type: UserAccessTokenTypes
  createdAt: Date
}

export interface UserModel {
  name: string
  username: string
  password: string
  accessTokens: UserAccessToken[]
}

export interface UserDocument extends Document, UserModel {
  _id: string
  createdAt: Date
  updatedAt: Date
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
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface Models {
  User: Model<UserDocument>
  Module: Model<ModuleDocument>
  Composition: Model<CompositionDocument>
}
