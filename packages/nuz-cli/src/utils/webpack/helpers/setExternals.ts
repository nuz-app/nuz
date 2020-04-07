import { DEPENDENCIES_KEY } from '@nuz/shared'

const setExternals = (name: string) => ({
  commonjs: name,
  commonjs2: name,
  root: [DEPENDENCIES_KEY, name],
})

export default setExternals
