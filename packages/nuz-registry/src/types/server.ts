export enum DBTypes {
  mongodb = 'mongodb',
  nedb = 'nedb',
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

export interface ServerOptions {
  key: string
  db: DBOptions
  serverless?: ServerlessOptions
}

export interface LocalDBOptions {
  path?: string
}
