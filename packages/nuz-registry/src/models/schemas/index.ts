import { Schema } from 'mongoose'

import { CollaboratorTypes } from '../../types'

export const userId = { type: String, required: true }

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

export const detailsResource = new Schema(
  {
    url: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    integrity: { type: String, required: true },
    md5sum: { type: String, required: true },
  },
  { _id: false },
)

export const resolveResource = new Schema(
  {
    url: { type: String, required: true },
    integrity: { type: String, required: true },
  },
  { _id: false },
)
