import { accessTokenHelpers } from '@nuz/utils'

import { MONGOOSE_ERROR_CODES } from '../lib/const'
import {
  CreateUserData,
  Models,
  UpdateUserData,
  UserAccessTokenTypes,
  UserId,
} from '../types'
import genarateTokenId from '../utils/genarateTokenId'

const UPDATE_FIELDS_ALLOWED = ['email', 'name', 'password']

class User {
  constructor(private readonly Collection: Models['User']) {}

  async create(data: CreateUserData) {
    const { email, name, username, password } = data

    // Create a new user instance.
    const user = new this.Collection({ email, name, username, password })

    //
    try {
      // Inserted the new scope to database.
      await user.save()

      return user
    } catch (error) {
      if (error.code === MONGOOSE_ERROR_CODES.UNIQUE_KEY_EXISTED) {
        throw new Error('User is already existed.')
      }

      throw error
    }
  }

  async update(id: UserId, data: UpdateUserData) {
    const selectedUser = await this.Collection.findOne({ _id: id }, { _id: 1 })

    //
    if (!selectedUser) {
      throw new Error('User is not found.')
    }

    // Check and update user information if valid.
    const keysOf = Object.keys(data)
    keysOf.forEach((key) => {
      const shouldBeUpdate = !!data[key] && UPDATE_FIELDS_ALLOWED.includes(key)
      if (shouldBeUpdate) {
        selectedUser[key] = data[key]
      }
    })

    // Updated the user document.
    await selectedUser.save()

    return { _id: selectedUser._id }
  }

  async login(username: string, password: string) {
    //
    const selectedUser = await this.Collection.findOne(
      { username },
      {
        _id: 1,
        username: 1,
        password: 1,
      },
    )

    //
    if (!selectedUser) {
      throw new Error('User is not existed.')
    }

    //
    if (!selectedUser.verifyPassword(password)) {
      throw new Error('Password is invalid.')
    }

    return { _id: selectedUser._id }
  }

  async verifyToken(token: string, requiredType: UserAccessTokenTypes) {
    const selectedUser = await this.Collection.findOne(
      { accessTokens: { $elemMatch: { value: token } } },
      { _id: 1, accessTokens: 1 },
    )

    //
    if (!selectedUser) {
      throw new Error(`User's token is invalid or incorrect.`)
    }

    //
    const accessToken = selectedUser.accessTokens.find(
      (item) => item.value === token,
    )
    if (!accessToken) {
      throw new Error(`User's token is invalid or incorrect.`)
    }

    //
    const isDenied = !accessTokenHelpers.verify(accessToken.type, requiredType)
    if (isDenied) {
      throw new Error(
        'The token does not have the authority to take this action.',
      )
    }

    return { _id: selectedUser._id }
  }

  async createToken(id: UserId, requiredType: UserAccessTokenTypes) {
    // Create new token information for the user.
    const accessToken = { value: genarateTokenId(), type: requiredType }

    // Updated token to the user document.
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      {
        $addToSet: {
          accessTokens: accessToken,
        },
      },
    )

    if (mofitied === 0) {
      throw new Error('User is not found.')
    }

    return { _id: id, mofitied, ok, accessToken }
  }

  async deleteToken(id: UserId, token: string) {
    // Deleted token from the user document.
    const { ok, nModified: mofitied } = await this.Collection.updateOne(
      { _id: id },
      { $pull: { accessTokens: { value: token } } },
    )

    if (mofitied === 0) {
      throw new Error('User is not found.')
    }

    return { _id: id, mofitied, ok }
  }
}

export function createService(collection: Models['User']) {
  return new User(collection)
}

export default User
