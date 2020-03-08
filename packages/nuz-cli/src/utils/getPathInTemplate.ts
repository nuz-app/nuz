import path from 'path'

const getPathInTemplate = (file: string) =>
  path.join(__dirname, '../../templates', file)

export default getPathInTemplate
