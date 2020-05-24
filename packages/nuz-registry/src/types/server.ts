import { ModuleFormats } from '@nuz/shared'
import compression from 'compression'

import { StorageTypes } from './common'

export enum DBTypes {
  mongodb = 'mongodb',
}

export interface MongoConfig {
  url: string
}

export interface ServerlessOptions {}

export interface HttpsConfig {
  key: Buffer | string
  cert: Buffer | string
}

export interface ServerOptions {
  db: MongoConfig
  dev?: boolean
  cache?: any
  https?: boolean | HttpsConfig
  compression?: boolean | compression.CompressionOptions
  serverless?: ServerlessOptions
  storageType?: StorageTypes
  storage?: any
  static?: string
}

export interface WorkerOptions {
  storageType: StorageTypes
  storage: any | null
  static: string | null
  cache?: any
}

export interface PublishOptions {
  fallback?: string
  static?: string
  schedule?: any
  selfHosted?: boolean
}

export interface RollbackInfo {
  name: string
  upstream: string
  fallback?: string
}
