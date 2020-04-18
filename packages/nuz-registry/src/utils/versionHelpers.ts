import maxSatisfying from 'semver/ranges/max-satisfying'
import valid from 'semver/ranges/valid'

export const checkIsValid = (version: string) => !!valid(version)

export const getMaxSatisfying = (
  versions: string[],
  range: string,
): string | null => maxSatisfying(versions, range)
