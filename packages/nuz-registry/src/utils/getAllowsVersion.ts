import { versionHelpers } from '@nuz/utils'

function getAllowsVersion(tags, versions, required): string | null {
  //
  const tag = tags.get(required)

  //
  const version = versionHelpers.getMaxSatisfying(versions, tag ?? required)

  //
  return version
}

export default getAllowsVersion
