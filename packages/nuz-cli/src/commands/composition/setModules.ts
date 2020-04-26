import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'

const pickIdAndversion = (key: string) => {
  const arr = key.split('@')
  if (arr.length === 3) {
    return {
      id: '@' + arr[1],
      version: arr[2],
    }
  }

  if (arr.length === 2) {
    return {
      id: arr[0],
      version: arr[1],
    }
  }

  throw new Error(`Can't parse info to get id and version!`)
}

async function setModules({
  composition,
  modules: modulesAsArray,
}: Arguments<{ composition: string; modules: string[] }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const modules = modulesAsArray.reduce((acc, idAndVersion) => {
    const { id, version } = pickIdAndversion(idAndVersion)
    return Object.assign(acc, { [id]: version })
  }, {})

  const request = await Worker.setModulesForComposition(composition, modules)
  const compositionId = request?.data?._id

  info('Composition id', print.name(compositionId))
  info(pretty(modules))
  success('Done!')
  return true
}

export default setModules
