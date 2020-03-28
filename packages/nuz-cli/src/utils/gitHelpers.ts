import { execSync, ExecSyncOptions } from 'child_process'
import path from 'path'
import rimraf from 'rimraf'

export const checkIsInGit = () => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export const initGitInDir = (dir: string) => {
  let didInit = false

  const execOptions: ExecSyncOptions = { stdio: 'ignore', cwd: dir }

  try {
    execSync('git --version', execOptions)

    if (checkIsInGit()) {
      return false
    }

    execSync('git init', execOptions)
    didInit = true

    execSync('git add -A', execOptions)
    execSync('git commit -m "Initial commit from Nuz"', execOptions)

    return true
  } catch (e) {
    if (didInit) {
      try {
        rimraf.sync(path.join(dir, '.git'))
      } catch {
        //
      }
    }
    return false
  }
}
