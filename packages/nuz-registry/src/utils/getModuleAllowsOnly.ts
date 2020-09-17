import { versionHelpers } from '@nuz/utils'

import { ModuleDocument, VersionInfo } from '../types'

import getAllowsVersion from './getAllowsVersion'
import getImportantFieldsOnly from './getImportantFieldsOnly'

function getModuleAllowsOnly(
  required: { id: string; version: string },
  modules: ModuleDocument[],
) {
  const selectedModule = modules.find((sub) => sub._id === required.id)
  if (!selectedModule) {
    throw new Error('REQUIRED_MODULE_NOT_FOUND')
  }

  //
  const allVersions = Array.from<string>(
    selectedModule.versions.keys(),
  ).map((sub) => versionHelpers.decode(sub))

  //
  const allowsVersion = getAllowsVersion(
    selectedModule.tags,
    allVersions,
    required.version,
  )
  if (!allowsVersion) {
    throw new Error('MODULE_UPSTREAM_VERSION_NOT_FOUND')
  }

  //
  const upstreamInformation = selectedModule.versions.get(
    versionHelpers.encode(allowsVersion),
  ) as VersionInfo

  //
  const allowsFallback =
    upstreamInformation.fallback &&
    getAllowsVersion(
      selectedModule.tags,
      allVersions,
      upstreamInformation.fallback,
    )
  const fallbackInformation = selectedModule.versions.get(
    versionHelpers.encode(allowsFallback as string),
  )

  return Object.assign(
    //
    {
      id: `${required.id}@${required.version}`,
      name: required.id,
      version: required.version,
    },
    //
    getImportantFieldsOnly(upstreamInformation as Required<VersionInfo>),
    //
    {
      upstream: upstreamInformation.resolve,
      fallback: fallbackInformation?.resolve,
    },
  )
}

export default getModuleAllowsOnly
