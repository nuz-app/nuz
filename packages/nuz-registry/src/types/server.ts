export enum DBTypes {
  mongodb = 'mongodb',
  nedb = 'nedb',
}

export type DBOptions = LocalDBOptions & {
  type: DBTypes
}

export interface ServerOptions {
  key: string
  db: DBOptions
}

export interface LocalDBOptions {
  path?: string
}
