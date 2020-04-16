import { Schema } from 'mongoose'

import { CollaboratorTypes } from '../../types'

export const userId = { type: Schema.Types.ObjectId, required: true }

export const createdAt = { type: Date, required: true, default: Date.now }

export const collaborator = new Schema(
  {
    id: userId,
    type: {
      type: String,
      required: true,
      enum: Object.values(CollaboratorTypes),
    },
    createdAt,
  },
  { _id: false },
)

export const resource = new Schema(
  {
    url: { type: String, required: true },
    integrity: { type: String, required: true },
  },
  { _id: false },
)
