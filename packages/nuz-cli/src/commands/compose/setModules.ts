import { UserAccessTokenTypes } from '@nuz/shared'
import { Arguments } from 'yargs'

import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

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
  compose,
  modules: modulesAsArray,
}: Arguments<{ compose: string; modules: string[] }>) {
  await Config.authRequired(UserAccessTokenTypes.fullAccess)

  const modules = modulesAsArray.reduce((acc, idAndVersion) => {
    const { id, version } = pickIdAndversion(idAndVersion)
    return Object.assign(acc, { [id]: version })
  }, {})

  const tick = timer()
  const request = await Worker.setModulesForCompose(compose, modules)
  const composeId = request?.data?._id

  info('Compose id', print.name(composeId))
  info(pretty(modules))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default setModules
