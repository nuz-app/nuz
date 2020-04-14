import { CollaboratorTypes } from '../types'

const VALUES = Object.values(CollaboratorTypes)

export const validate = (value: string) => VALUES.includes(value as any)

const POINTS = {
  1: CollaboratorTypes.contributor,
  5: CollaboratorTypes.maintainer,
  10: CollaboratorTypes.creator,
}
export const parse = (value: CollaboratorTypes) => POINTS[value] || -1

export const verify = (value: CollaboratorTypes, required: CollaboratorTypes) =>
  parse(value) >= parse(required)
