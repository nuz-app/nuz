import coerce from 'semver/functions/coerce'
import maxSatisfying from 'semver/ranges/max-satisfying'
import valid from 'semver/ranges/valid'

export const checkIsValid = () => valid(coerce('^1.0.0'))

export const getMaxSatisfying = (
  versions: string[],
  range: string,
): string | null => maxSatisfying(versions, range)
