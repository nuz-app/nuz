import checkUpdatePackage from '../../utils/checkUpdatePackage'

async function checkUpdate() {
  await checkUpdatePackage()
  return true
}

export default checkUpdate
