import {
  CreateUserData,
  Models,
  TObjectId,
  UpdateUserData,
  UserAccessTokenTypes,
} from '../types'

import genarateTokenId from '../utils/genarateTokenId'

const UPDATE_FIELDS_ALLOWED = ['email', 'name', 'password']

class User {
  constructor(private readonly Collection: Models['User']) {}

  async create(data: CreateUserData) {
    const { email, name, username, password } = data

    const user = new this.Collection({ email, name, username, password })
    user.save()

    console.log({ user })
    return user
  }

  async update(id: TObjectId, data: UpdateUserData) {
    const keysOf = Object.keys(data)
    const info = keysOf
      .filter((key) => UPDATE_FIELDS_ALLOWED.includes(key))
      .reduce((acc, key) => Object.assign(acc, { [key]: data[key] }), {})

    const updated = await this.Collection.update({ _id: id }, { $set: info })

    return {}
  }

  async login(username: string, password: string) {
    const user = await this.Collection.findOne(
      { username },
      { _id: 1, username: 1, password: 1 },
    )
    if (!user) {
      throw new Error('Username is not existed')
    }

    const isMatched = user.comparePassword(password)
    if (!isMatched) {
      throw new Error('Password is invalid')
    }

    return { _id: user._id }
  }

  async verifyToken(token: string, requiredType: UserAccessTokenTypes) {
    const user = await this.Collection.findOne(
      { accessTokens: { $elemMatch: { value: token } } },
      { _id: 1, accessTokens: 1 },
    )
    if (!user) {
      throw new Error(`Invalid token`)
    }

    const accessToken = user.accessTokens.find((item) => item.value === token)
    if (!accessToken) {
      throw new Error(`Not found token by value ${token}`)
    }

    if (accessToken.type < requiredType) {
      throw new Error('Permission defined')
    }

    return { _id: user._id }
  }

  async createToken(id: TObjectId, requiredType: UserAccessTokenTypes) {
    const value = genarateTokenId()
    const createdAt = new Date()
    const accessToken = { value, createdAt, type: requiredType }
    const result = await this.Collection.updateOne(
      { _id: id },
      { $push: { accessTokens: accessToken } },
    )

    return { _id: id, accessToken }
  }

  async deleteToken(id: TObjectId, token: string) {
    const result = await this.Collection.updateOne(
      { _id: id },
      { $pull: { accessTokens: { value: token } } },
    )

    return { _id: id }
  }
}

export const createService = (collection: Models['User']) =>
  new User(collection)

export default User
