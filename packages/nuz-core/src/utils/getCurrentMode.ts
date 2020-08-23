import { RunModes } from '../types/common'

function getCurrentMode(): RunModes {
  return process.env.NODE_ENV === 'production'
    ? RunModes.production
    : RunModes.development
}

export default getCurrentMode
