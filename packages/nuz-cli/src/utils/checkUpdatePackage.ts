import checkForUpdate, { Result } from 'update-check'

import * as paths from '../paths'
import checkIsYarnInstalled from './checkIsYarnInstalled'
import print, { error, log } from './print'

async function checkUpdatePackage() {
  const pkg = require(paths.resolvePackageJson(paths.tool))

  let update: Result | null = null

  try {
    update = await checkForUpdate(pkg, {
      interval: 1800000, // 12h
      distTag: 'latest',
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
      useYarn ? 'yarn global add @nuz/cli' : 'npm install -g @nuz/cli',
    )
    log()
    log()
  }
}

export default checkUpdatePackage
