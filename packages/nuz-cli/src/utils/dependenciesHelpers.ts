import execa from 'execa'

import checkIsYarnInstalled from './checkIsYarnInstalled'

export interface InstallConfiguration {
  useYarn: boolean
}

export async function installAsDev(
  directory: string,
  dependencies: string[],
  config: InstallConfiguration,
): Promise<any> {
  const { useYarn } = config

  const [bin, cmd, flat] =
    useYarn || checkIsYarnInstalled()
      ? ['yarn', 'add', '--dev']
      : ['npm', 'install', '--dev']

  const subprocess = execa(bin, [cmd, ...dependencies, flat].filter(Boolean), {
    cwd: directory,
    stdout: process.stdout,
    stderr: process.stderr,
  })

  return await subprocess
}

export async function install(
  directory: string,
  config: InstallConfiguration,
): Promise<any> {
  const { useYarn } = config

  const [bin, cmd] =
    useYarn || checkIsYarnInstalled() ? ['yarn', 'install'] : ['npm', 'install']
  const subprocess = execa(bin, [cmd].filter(Boolean), {
    cwd: directory,
    stdout: process.stdout,
    stderr: process.stderr,
  })

  return await subprocess
}
