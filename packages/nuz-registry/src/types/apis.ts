import { CollaboratorTypes, TObjectId } from './common'

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

export interface AddCollaboratorData {
  id: TObjectId
  type: CollaboratorTypes
}
