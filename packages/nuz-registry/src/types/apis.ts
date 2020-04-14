import { TObjectId } from './common'

export interface CreateUserData {
  name: string
  email: string
  username: string
  password: string
}

export interface UpdateUserData {
  name: string
  email: string
  password: string
}

export interface CreateCompositionData {
  userId: TObjectId
  name: string
  modules: string[]
}
