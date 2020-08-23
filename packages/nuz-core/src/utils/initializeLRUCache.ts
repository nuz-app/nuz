import LRUCache from 'lru-cache'

export type { LRUCache }

function initializeLRUCache(): LRUCache<any, any> {
  return new LRUCache({
    max: 50,
    maxAge: 1000 * 60 * 60,
  })
}

export default initializeLRUCache
