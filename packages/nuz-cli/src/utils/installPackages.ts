import execa from 'execa'

import checkIsYarnInstalled from './checkIsYarnInstalled'

export interface InstallPackagesConfig {
  useYarn: boolean
}

const getBin = (useYarn: boolean) => {
  const yarnIsExisted = useYarn || checkIsYarnInstalled()
  return yarnIsExisted ? 'yarn' : 'npm'
}

const installPackages = async (dir: string, config: InstallPackagesConfig) => {
  const { useYarn } = config

  const bin = getBin(useYarn)
  const subprocess = execa(bin, ['install'], {
    cwd: dir,
    stdout: process.stdout,
    stderr: process.stderr,
  })

  const result = await subprocess
  return result
}

export default installPackages
