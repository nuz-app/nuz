import { Connection, Model, Schema } from 'mongoose'

import { ModuleDocument, ModuleFormats } from '../types'

import {
  collaborator as collaboratorSchema,
  createdAt as createdAtSchema,
  resource as resourceSchema,
  userId as userIdSchema,
} from './schemas'

export const collection = 'Module'

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
    tags: {
      type: Map,
      of: String,
      required: true,
      default: () => new Map(),
    },
    collaborators: [collaboratorSchema],
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
          publisher: userIdSchema,
          createdAt: createdAtSchema,
          resolve: {
            main: resourceSchema,
            styles: [resourceSchema],
          },
          alias: { type: Schema.Types.Mixed, required: false },
          exportsOnly: [String],
          fallback: { type: String, required: false },
          deprecated: { type: String, required: false },
        },
        { _id: false },
      ),
      required: true,
      default: () => new Map(),
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
