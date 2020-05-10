import checkForUpdate, { Result } from 'update-check'

import checkIsYarnInstalled from './checkIsYarnInstalled'
import * as paths from './paths'
import print, { error, info, log } from './print'

async function checkUpdatePackage() {
  const pkg = require(paths.packageJsonInDir(paths.tool))
  pkg.version = '1.0.0-beta.1'

  let update: Result | null = null

  try {
    update = await checkForUpdate(pkg)
  } catch (err) {
    error(`Failed to check for updates: ${err}`)
  }

  if (update) {
    const useYarn = checkIsYarnInstalled()
    log()
    info(
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
