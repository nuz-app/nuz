import { UserAccessTokenTypes } from '@nuz/shared'
import { Document, Model, Types } from 'mongoose'

import {
  Collaborator,
  ModuleId,
  RequiredModule,
  Schedule,
  ScopeId,
  TokenId,
  UserId,
  VersionInfo,
} from './common'

export { UserAccessTokenTypes } from '@nuz/shared'

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
  _id: ModuleId
  createdAt: Date
  updatedAt: Date
}

/**
 * Scope
 */

export interface ScopeModel {
  name: string
  collaborators: Collaborator[]
}

export interface ScopeDocument extends Document, ScopeModel {
  _id: ScopeId
  createdAt: Date
  updatedAt: Date
}

export interface UserAccessToken {
  value: TokenId
  type: UserAccessTokenTypes
  createdAt?: Date
}

export interface UserModel {
  name: string
  email: string
  username: string
  password: string
  accessTokens: UserAccessToken[]
}

export interface UserDocument extends Document, UserModel {
  _id: UserId
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
  modules: Types.Array<RequiredModule>
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
  Scope: Model<ScopeDocument>
}
