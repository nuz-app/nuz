import { RuntimePlatforms } from '../types/common'

const getRuntimePlatform = (): RuntimePlatforms =>
  typeof window === 'undefined' ? RuntimePlatforms.node : RuntimePlatforms.web

export default getRuntimePlatform
