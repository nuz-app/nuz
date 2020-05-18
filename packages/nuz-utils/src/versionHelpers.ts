import compare from 'semver/functions/compare'
import rcompare from 'semver/functions/rcompare'
import satisfies from 'semver/functions/satisfies'
import maxSatisfying from 'semver/ranges/max-satisfying'
import valid from 'semver/ranges/valid'

export const checkIsValid = (version: string) => !!valid(version)

export const getMaxSatisfying = (
  versions: string[],
  range: string,
): string | null => maxSatisfying(versions, range)

export const getSatisfies = (versions: string[], range: string): string[] =>
  versions.filter((version) => satisfies(version, range))

export const order = (
  versions: string[],
  isMaxToSmall: boolean = true,
): string[] => versions.sort(isMaxToSmall ? rcompare : compare)

// Convert `1.23.45-beta.6` -> `1:23:45-beta:6`
export const encode = (version: string) => (version || '').replace(/\./g, ':')

// Convert `1:23:45-beta:6` -> `1.23.45-beta.6`
export const decode = (version: string) => (version || '').replace(/\:/g, '.')
