import compare from 'semver/functions/compare'
import rcompare from 'semver/functions/rcompare'
import satisfies from 'semver/functions/satisfies'
import maxSatisfying from 'semver/ranges/max-satisfying'
import valid from 'semver/ranges/valid'

export function checkIsValid(version: string): boolean {
  return !!valid(version)
}

export function getMaxSatisfying(
  versions: string[],
  range: string,
): string | null {
  return maxSatisfying(versions, range)
}

export function getSatisfies(versions: string[], range: string): string[] {
  return versions.filter((version) => satisfies(version, range))
}

export function order(
  versions: string[],
  isMaxToSmall: boolean = true,
): string[] {
  return versions.sort(isMaxToSmall ? rcompare : compare)
}

// Convert `1.23.45-beta.6` -> `1:23:45-beta:6`
export function encode(version: string): string {
  return (version || '').replace(/\./g, ':')
}

// Convert `1:23:45-beta:6` -> `1.23.45-beta.6`
export function decode(version: string): string {
  return (version || '').replace(/\:/g, '.')
}
