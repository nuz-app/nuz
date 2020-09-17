import { versionHelpers } from '@nuz/utils'

function getAllowsVersion(tags, versions, required): string {
  //
  const tag = tags.get(required)

  //
  const version = tag || versionHelpers.getMaxSatisfying(versions, required)

  //
  return tag || version
}

export default getAllowsVersion
