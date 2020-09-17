import { DEPENDENCIES_KEY } from '@nuz/shared'

const setExternals = (name: string, isolated: boolean) => ({
  commonjs: name,
  commonjs2: name,
  root: isolated ? name : [DEPENDENCIES_KEY, name],
})

export default setExternals
