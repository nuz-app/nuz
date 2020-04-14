import { UserAccessTokenTypes } from '../types'

const VALUES = Object.values(UserAccessTokenTypes)

export const validate = (value: string) => VALUES.includes(value as any)

const POINTS = {
  1: UserAccessTokenTypes.readOnly,
  5: UserAccessTokenTypes.publish,
  10: UserAccessTokenTypes.fullAccess,
}
export const parse = (value: UserAccessTokenTypes) => POINTS[value] || -1

export const verify = (
  value: UserAccessTokenTypes,
  required: UserAccessTokenTypes,
) => parse(value) >= parse(required)
