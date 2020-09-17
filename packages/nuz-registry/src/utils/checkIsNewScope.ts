const RANGE_LIMIT = 24 * 60 * 60 * 1000

function checkIsNewScope(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < RANGE_LIMIT
}

export default checkIsNewScope
