import execa from 'execa'
import path from 'path'
import rimraf from 'rimraf'

export function run(args: any, directory: string) {
  const options: execa.SyncOptions<string> = {
    cwd: directory,
  }

  return execa.sync('git', args, options)
}

export function isInitialized(directory: string) {
  try {
    run(['rev-parse', '--is-inside-work-tree'], directory)
    return true
  } catch {
    return false
  }
}

export function initialize(directory: string, message: string) {
  let didInit = false

  try {
    run(['--version'], directory)

    if (isInitialized(directory)) {
      return false
    }

    run(['init'], directory)
    didInit = true

    run(['add', '-A'], directory)
    run(['commit', `-m "${JSON.stringify(message)}"`], directory)

    return true
  } catch (e) {
    if (didInit) {
      try {
        rimraf.sync(path.join(directory, '.git'))
        // tslint:disable-next-line: no-empty
      } catch {}
    }
    return false
  }
}
