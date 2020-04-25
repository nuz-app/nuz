import { Connection, Model, Schema } from 'mongoose'

import { ScopeDocument } from '../types'

import { collaborator as collaboratorSchema } from './schemas'

export const collection = 'Scope'

const schema: Schema = new Schema(
  {
    _id: {
      type: String,
      default() {
        // @ts-ignore
        return this.name
      },
    },
    name: { type: String, required: true },
    collaborators: [collaboratorSchema],
  },
  {
    collection,
    versionKey: false,
    autoIndex: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
)

schema.index(
  {},
  {
    background: true,
  },
)

export const createModel = (connection: Connection): Model<ScopeDocument> =>
  connection.model(collection, schema)
