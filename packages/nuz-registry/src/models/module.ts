import { Connection, Model, Schema } from 'mongoose'

import { CollaboratorTypes, ModuleDocument, ModuleFormats } from '../types'

export const collection = 'Module'

const schema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    tags: {
      upstream: { type: String, required: true },
      fallback: { type: String, required: false, default: null },
    },
    collaborators: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        type: {
          type: String,
          required: true,
          enum: Object.values(CollaboratorTypes),
        },
      },
    ],
    versions: {
      type: Map,
      of: {
        version: { type: String, required: true },
        library: { type: String, required: true },
        format: {
          type: String,
          required: true,
          enum: Object.values(ModuleFormats),
        },
        createdAt: { type: Date, required: true },
        resolve: {
          main: {
            url: { type: String, required: true },
            integrity: { type: String, required: true },
          },
          styles: [
            {
              url: { type: String, required: true },
              integrity: { type: String, required: true },
            },
          ],
        },
        alias: { type: Schema.Types.Mixed, required: false },
        exportsOnly: [{ type: String, required: false }],
      },
      required: true,
    },
    // schedule: { type: Schema.Types.Mixed, required: false, default: {} },
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
  {},
  {
    background: true,
  },
)

export const createModel = (connection: Connection): Model<ModuleDocument> =>
  connection.model(collection, schema)
