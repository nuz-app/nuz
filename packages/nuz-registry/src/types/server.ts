import { ModuleFormats } from '@nuz/shared'
import compression from 'compression'

import { StorageTypes } from './common'

export enum DBTypes {
  mongodb = 'mongodb',
}

export interface MongoConfig {
  url: string
}

export interface FetchRouteOptions {
  cacheTime: number
  prepareTime: number
}

export interface ServerlessOptions {
  fetch?: Partial<FetchRouteOptions>
}

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
}

export interface WorkerOptions {
  storageType: StorageTypes
  cache?: any
  storage?: any
}

export interface LocalDBOptions {
  path?: string
}

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
  format?: ModuleFormats
}

export interface PublishOptions {
  fallback?: string
  schedule?: any
  selfHosted?: boolean
}

export interface RollbackInfo {
  name: string
  upstream: string
  fallback?: string
}
