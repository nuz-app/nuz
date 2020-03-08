export interface ModuleSignature {
  name: string
  version: string
}

const getModuleSignature = ({ name, version }: ModuleSignature) => `
/**
 * @name ${name}
 * @version ${version}
 */
`

export default getModuleSignature
