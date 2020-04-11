import { Connection, Model, Schema } from 'mongoose'

import { CollaboratorTypes, CompositionDocument } from '../types'

export const collection = 'Composition'

const schema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
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
    modules: [String],
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

export const createModel = (
  connection: Connection,
): Model<CompositionDocument> => connection.model(collection, schema)
