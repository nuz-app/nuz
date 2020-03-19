import compression from 'compression'

export enum DBTypes {
  mongodb = 'mongodb',
}

export type DBOptions = LocalDBOptions & {
  type: DBTypes
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
  db: DBOptions
  https?: boolean | HttpsConfig
  compression?: boolean | compression.CompressionOptions
  serverless?: ServerlessOptions
}

export interface LocalDBOptions {
  path?: string
}
