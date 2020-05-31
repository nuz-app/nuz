import path from 'path'

function ensurePath(dir: string, input: string) {
  const ensuredPath = path.isAbsolute(input) ? input : path.join(dir, input)
  const directory = path.dirname(ensuredPath)
  const filename = path.basename(ensuredPath)

  return {
    path: ensuredPath,
    directory,
    filename,
  }
}

export default ensurePath
