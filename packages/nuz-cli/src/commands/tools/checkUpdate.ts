import checkIsOnline from '../../utils/checkIsOnline'
import checkUpdatePackage from '../../utils/checkUpdatePackage'
import { log, warn } from '../../utils/print'

async function checkUpdate(): Promise<boolean> {
  const isOnline = await checkIsOnline()
  if (isOnline) {
    await checkUpdatePackage()
  } else {
    warn(`Network is offline. Can't check update for the package.`)
    log()
  }

  return true
}

export default checkUpdate
