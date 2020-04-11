import { Schema, Types } from 'mongoose'

export enum ModuleFormats {
  umd = 'umd',
}

export interface Resource {
  url: string
  integrity: string
}

export enum CollaboratorTypes {
  creator = 'creator',
  maintainer = 'maintainer',
}

export interface Collaborator {
  id: Schema.Types.ObjectId
  type: CollaboratorTypes
}

export type TObjectId = Types.ObjectId
