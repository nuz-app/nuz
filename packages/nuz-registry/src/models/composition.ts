import { Connection, Model, Schema } from 'mongoose'

import { CompositionDocument } from '../types'

import { collaborator as collaboratorSchema } from './schemas'

export const collection = 'Composition'

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
    modules: {
      type: Map,
      of: String,
      default: () => new Map(),
    },
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

export const createModel = (
  connection: Connection,
): Model<CompositionDocument> => connection.model(collection, schema)
