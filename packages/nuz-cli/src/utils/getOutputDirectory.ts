import path from 'path'

function getOutputDirectory(directory: string, output: string): string {
  return path.join(directory, path.dirname(output))
}

export default getOutputDirectory
