import checkForUpdate, { Result } from 'check-update-package'

import * as paths from '../paths'

import checkIsYarnInstalled from './checkIsYarnInstalled'
import print, { error, log } from './print'
import readPackageJson from './readPackageJson'

async function checkUpdatePackage(): Promise<void> {
  const packageJson = readPackageJson(paths.tool)

  let update: Result | null = null

  try {
    update = await checkForUpdate(packageJson, {
      interval: 1800000, // 12h
      distTag: 'latest',
      timeout: 4000,
    })
  } catch (err) {
    error(`Failed to check for updates: ${err}`)
  }

  if (update) {
    const useYarn = checkIsYarnInstalled()

    log()
    log(
      `The latest available version is ${print.cyan(
        update.latest,
      )}, please update it!`,
    )
    log()
    log(print.dim(`Install with the following command:`))
    log(
      print.dim('$ '),
      useYarn
        ? `yarn global add ${packageJson.name}`
        : `npm install -g ${packageJson.name}`,
    )
    log()
    log()
  }
}

export default checkUpdatePackage
