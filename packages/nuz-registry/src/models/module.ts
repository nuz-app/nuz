import { Connection, Model, Schema } from 'mongoose'

import { ModuleDocument } from '../types'

export const collection = 'Module'

const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    tags: {
      upstream: { type: String, required: true },
      fallback: { type: String, required: false, default: null },
    },
    schedule: { type: Schema.Types.Mixed, required: false, default: {} },
    versions: { type: Schema.Types.Mixed, required: false, default: {} },
  },
  {
    collection,
    versionKey: false,
    autoIndex: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    _id: true,
  },
)

schema.index(
  { name: 1 },
  {
    background: true,
  },
)

export const createModel = (connection: Connection): Model<ModuleDocument> =>
  connection.model(collection, schema)
