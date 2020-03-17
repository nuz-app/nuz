import { Document, Model } from 'mongoose'

export interface PublishInfo {
  name: string
  version: string
  library: string
  resolve: {
    main: string
    styles: string[]
  }
  alias?: { [key: string]: string }
  exportsOnly?: string[]
  format?: string
}

export interface PublishOptions {
  fallback?: boolean
  schedule?: any
}

export interface RollbackInfo {
  name: string
  upstream: string
  fallback?: string
}

export interface PermissionModel {
  scope: string[]
}

export interface PermissionDocument extends Document, PermissionModel {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface Resource {
  url: string
  integrity: string
}

export interface Schedule {}

export type VersionInfo = Omit<PublishInfo, 'name' | 'version' | 'resolve'> & {
  resolve: {
    main: Resource
    styles: Resource[]
  }
}

export interface ModuleModel {
  name: string
  tags: {
    upstream: string
    fallback: string
  }
  schedule?: Schedule
  versions: { [version: string]: VersionInfo }
}

export interface ModuleDocument extends Document, ModuleModel {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface Models {
  Module: Model<ModuleDocument>
  Permission: Model<PermissionDocument>
}
