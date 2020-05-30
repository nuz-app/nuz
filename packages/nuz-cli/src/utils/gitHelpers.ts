import execa from 'execa'
import path from 'path'
import rimraf from 'rimraf'

export function run(args, dir: string) {
  const options: execa.SyncOptions<string> = {
    cwd: dir,
  }

  return execa.sync('git', args, options)
}

export function isInitialized(dir: string) {
  try {
    run(['rev-parse', '--is-inside-work-tree'], dir)
    return true
  } catch {
    return false
  }
}

export function initial(dir: string) {
  let didInit = false

  try {
    run(['--version'], dir)

    if (isInitialized(dir)) {
      return false
    }

    run(['init'], dir)
    didInit = true

    run(['add', '-A'], dir)
    run(['commit', '-m "Initial project by Nuz"'], dir)

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
