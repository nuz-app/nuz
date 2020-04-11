import compression from 'compression'

import { ModuleFormats } from './common'

export enum DBTypes {
  mongodb = 'mongodb',
}

export interface MongoOptions {
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
  key: string
  db: MongoOptions
  https?: boolean | HttpsConfig
  compression?: boolean | compression.CompressionOptions
  serverless?: ServerlessOptions
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
  fallback?: boolean
  schedule?: any
}

export interface RollbackInfo {
  name: string
  upstream: string
  fallback?: string
}
