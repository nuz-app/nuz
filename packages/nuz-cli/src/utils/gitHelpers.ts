import execa from 'execa'
import path from 'path'
import rimraf from 'rimraf'

export const initGitInDir = (dir: string) => {
  let didInit = false

  const execOptions: execa.Options = {
    cwd: dir,
  }

  function git(...args) {
    return execa('git', args, execOptions)
  }

  function checkIsInGit() {
    try {
      git('rev-parse --is-inside-work-tree')
      return true
    } catch {
      return false
    }
  }

  try {
    git('--version')

    if (checkIsInGit()) {
      return false
    }

    git('init')
    didInit = true

    git('add -A')
    git('commit -m "Initial project by Nuz"')

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
