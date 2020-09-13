import { UserAccessTokenTypes } from '@nuz/shared'

const VALUES = Object.values(UserAccessTokenTypes)

const POINTS = {
  1: UserAccessTokenTypes.readOnly,
  5: UserAccessTokenTypes.publish,
  10: UserAccessTokenTypes.fullAccess,
}

export function validate(value: string): boolean {
  return VALUES.includes(value as any)
}

export function parse(value: UserAccessTokenTypes): UserAccessTokenTypes | -1 {
  return (POINTS as any)[value] || -1
}

export function verify(
  value: UserAccessTokenTypes,
  required: UserAccessTokenTypes,
): boolean {
  return parse(value) >= parse(required)
}
