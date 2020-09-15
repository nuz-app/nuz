import checkIsOnline from '../../utils/checkIsOnline'
import checkUpdatePackage from '../../utils/checkUpdatePackage'

async function checkUpdate(): Promise<boolean> {
  const isOnline = await checkIsOnline()
  if (isOnline) {
    await checkUpdatePackage()
  }

  return true
}

export default checkUpdate
