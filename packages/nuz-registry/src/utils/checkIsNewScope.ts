const LIMIT_TIME = 24 * 60 * 60 * 1000

const checkIsNewScope = (createdAt: Date) =>
  Date.now() - createdAt.getTime() < LIMIT_TIME

export default checkIsNewScope
