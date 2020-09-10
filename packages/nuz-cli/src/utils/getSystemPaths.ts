import path from 'path'

function getSystemPaths(
  directory: string,
  input: string,
): {
  path: string
  directory: string
  filename: string
} {
  const absolute = path.isAbsolute(input) ? input : path.join(directory, input)

  return {
    path: absolute,
    directory: path.dirname(absolute),
    filename: path.basename(absolute),
  }
}

export default getSystemPaths
