import { Connection, Model, Schema } from 'mongoose'

import { CollaboratorTypes, ModuleDocument, ModuleFormats } from '../types'

export const collection = 'Module'

const schema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default() {
        // @ts-ignore
        return this.name
      },
    },
    name: { type: String, required: true },
    tags: {
      upstream: { type: String, required: true },
      fallback: { type: String, required: false, default: null },
    },
    collaborators: [
      new Schema(
        {
          id: { type: Schema.Types.ObjectId, required: true },
          type: {
            type: String,
            required: true,
            enum: Object.values(CollaboratorTypes),
          },
          createdAt: { type: Date, required: true, default: Date.now },
        },
        { _id: false },
      ),
    ],
    versions: {
      type: Map,
      of: new Schema(
        {
          version: { type: String, required: true },
          library: { type: String, required: true },
          format: {
            type: String,
            required: true,
            enum: Object.values(ModuleFormats),
          },
          publisher: { type: Schema.Types.ObjectId, required: true },
          createdAt: { type: Date, required: true, default: Date.now },
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
          deprecated: { type: String, required: false, default: null },
        },
        { _id: false },
      ),
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
