import { versionHelpers } from '@nuz/utils'

import { ModuleDocument, VersionInfo } from '../types'

function pickVersionIfExisted(tags, versions, requiredVersion) {
  const useTag = tags.get(requiredVersion)
  const useVersion =
    useTag || versionHelpers.getMaxSatisfying(versions, requiredVersion)
  return useTag || useVersion
}

function pickVersionInfo({
  exportsOnly,
  createdAt,
  format,
  library,
  publisher,
  shared,
  externals,
}) {
  return {
    exportsOnly,
    createdAt,
    format,
    library,
    publisher,
    shared,
    externals,
  }
}

function pickAndParseModule(
  selected: { id: string; version: string },
  modules: ModuleDocument[],
) {
  const matchedModule = modules.find((sub) => sub._id === selected.id)
  if (!matchedModule) {
    throw new Error('REQUIRED_MODULE_NOT_FOUND')
  }

  const allVersions = Array.from<string>(
    matchedModule.versions.keys(),
  ).map((sub) => versionHelpers.decode(sub))

  const useVersion = pickVersionIfExisted(
    matchedModule.tags,
    allVersions,
    selected.version,
  )
  if (!useVersion) {
    throw new Error('MODULE_UPSTREAM_VERSION_NOT_FOUND')
  }

  const upstreamInfo = matchedModule.versions.get(
    versionHelpers.encode(useVersion),
  ) as VersionInfo
  const { fallback } = upstreamInfo

  const useFallback =
    fallback && pickVersionIfExisted(matchedModule.tags, allVersions, fallback)
  const fallbackInfo = matchedModule.versions.get(
    versionHelpers.encode(useFallback),
  )

  return {
    id: `${selected.id}@${selected.version}`,
    name: selected.id,
    version: selected.version,
    ...pickVersionInfo(upstreamInfo as Required<VersionInfo>),
    upstream: upstreamInfo.resolve,
    fallback: fallbackInfo?.resolve,
  }
}

export default pickAndParseModule
