import { StorageTypes } from './common'

export enum DBTypes {
  mongodb = 'mongodb',
}

export interface DatabaseConfiguration {
  url: string
}

// tslint:disable-next-line: no-empty-interface
export interface ServerlessOptions {}

export interface HttpsConfiguration {
  key: Buffer | string
  cert: Buffer | string
}

export interface ServerOptions {
  db: DatabaseConfiguration
  storage: {
    type: StorageTypes
    worker?: any
  }
  dev?: boolean
  cache?: any
  https?: boolean | HttpsConfiguration
  serverless?: ServerlessOptions
  cdn?: string
}

export interface WorkerOptions {
  storage: {
    type: StorageTypes
    worker?: any
  }
  cdn?: string
  cache?: any
}

export interface PublishOptions {
  fallback?: string
  cdn?: string
  schedule?: any
  selfHosted?: boolean
}

export interface RollbackInfo {
  name: string
  upstream: string
  fallback?: string
}
