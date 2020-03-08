import { RunModes } from '../types/common'

const getCurrentMode = () =>
  process.env.NODE_ENV === 'production'
    ? RunModes.production
    : RunModes.development

export default getCurrentMode
