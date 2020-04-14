const LIMIT_TIME = 24 * 60 * 60 * 1000

const checkIsNewComposition = (createdAt: Date) =>
  new Date().getTime() - createdAt.getTime() >= LIMIT_TIME

export default checkIsNewComposition
