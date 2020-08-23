import { RuntimePlatforms } from '../types/common'

function getCurrentPlatform(): RuntimePlatforms {
  return typeof window === 'undefined'
    ? RuntimePlatforms.node
    : RuntimePlatforms.web
}

export default getCurrentPlatform
