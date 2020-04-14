import { MONGOOSE_ERROR_CODES } from '../lib/const'
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
    try {
      await user.save()
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('Username is already existed')
      }

      throw error
    }

    console.log({ user })
    return user
  }

  async findById(id: TObjectId, fields?: any) {
    return this.Collection.findOne({ _id: id }, fields || { _id: 1 })
  }

  async findByUsername(username: string, fields?: any) {
    return this.Collection.findOne({ username }, fields || { _id: 1 })
  }

  async update(id: TObjectId, data: UpdateUserData) {
    const user = await this.findById(id)
    if (!user) {
      throw new Error('User is not found')
    }

    const keysOf = Object.keys(data)
    keysOf.forEach((key) => {
      const shouldBeUpdate = !!data[key] && UPDATE_FIELDS_ALLOWED.includes(key)
      if (shouldBeUpdate) {
        user[key] = data[key]
      }
    })

    const reuslt = await user.save()

    return { _id: user._id }
  }

  async login(username: string, password: string) {
    const user = await this.findByUsername(username, {
      _id: 1,
      username: 1,
      password: 1,
    })
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
    const value = genarateTokenId(id)
    const createdAt = new Date()
    const accessToken = { value, createdAt, type: requiredType }
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $push: { accessTokens: accessToken } },
    )

    if (mofitied === 0) {
      throw new Error('User is not found')
    }

    return { _id: id, mofitied, ok, accessToken }
  }

  async deleteToken(id: TObjectId, token: string) {
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { accessTokens: { value: token } } },
    )

    if (mofitied === 0) {
      throw new Error('User is not found')
    }

    return { _id: id, mofitied, ok }
  }
}

export const createService = (collection: Models['User']) =>
  new User(collection)

export default User
