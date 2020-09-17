import { CollaboratorTypes } from '../types'

const VALUES = Object.values(CollaboratorTypes)

const POINTS = {
  1: CollaboratorTypes.contributor,
  5: CollaboratorTypes.maintainer,
  10: CollaboratorTypes.creator,
}

export function validate(value: string): boolean {
  return VALUES.includes(value as any)
}

export function parse(value: CollaboratorTypes): number {
  return POINTS[value] || -1
}

export function verify(
  value: CollaboratorTypes,
  required: CollaboratorTypes,
): boolean {
  return parse(value) >= parse(required)
}
