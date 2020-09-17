const RANGE_LIMIT = 24 * 60 * 60 * 1000

function checkIsNewCompose(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < RANGE_LIMIT
}

export default checkIsNewCompose
