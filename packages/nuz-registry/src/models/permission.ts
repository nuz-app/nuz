import { Connection, Model, Schema } from 'mongoose'

import { PermissionDocument } from '../types'

export const collection = 'Permission'

const schema: Schema = new Schema(
  {
    scope: { type: [String], required: true },
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
  { scope: 1 },
  {
    background: true,
  },
)

export const createModel = (
  connection: Connection,
): Model<PermissionDocument> => connection.model(collection, schema)
