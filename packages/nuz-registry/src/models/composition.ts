import { Connection, Model, Schema } from 'mongoose'

import { CollaboratorTypes, CompositionDocument } from '../types'

export const collection = 'Composition'

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
