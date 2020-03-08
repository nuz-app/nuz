import { execSync } from 'child_process'

function checkIsYarnInstalled() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

export default checkIsYarnInstalled
