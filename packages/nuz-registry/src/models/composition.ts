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
    modules: [
      new Schema(
        {
          id: { type: String, required: true },
          version: { type: String, required: true },
        },
        { _id: false },
      ),
    ],
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
