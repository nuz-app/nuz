import { Models } from '../types'

type UserDB = Pick<Models, 'User'>

class User {
  constructor(private readonly db: UserDB) {}
}

export const createService = (db: UserDB) => new User(db)

export default User
