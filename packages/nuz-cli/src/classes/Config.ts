import { UserAccessTokenTypes } from '@nuz/shared'
import { accessTokenHelpers } from '@nuz/utils'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

import {
  ROOT_CURRENT_WORKING_FILENAME,
  ROOT_USERS_DIRECTORY,
  ROOT_USER_AUTHENTICATION_FILENAME,
  ROOT_USER_CONFIGURATION_FILENAME,
  ROOT_USER_DEFAULT_DIRECTORY,
} from '../lib/const'
import * as paths from '../paths'
import {
  AuthenticationData,
  AuthenticationFields,
  ConfigurationData,
} from '../types'
import printer, { info, warn } from '../utils/print'

const configPaths = {
  current: paths.resolveRootDirectory(ROOT_CURRENT_WORKING_FILENAME),
  users: paths.resolveRootDirectory(ROOT_USERS_DIRECTORY),
  configuration: paths.resolveRootDirectory(
    ROOT_CURRENT_WORKING_FILENAME,
    ROOT_USER_CONFIGURATION_FILENAME,
  ),
  authentication: paths.resolveRootDirectory(
    ROOT_CURRENT_WORKING_FILENAME,
    ROOT_USER_AUTHENTICATION_FILENAME,
  ),
}

class Config {
  static async use(username: string): Promise<void> {
    const resolveUserDirectory = path.join(configPaths.users, username)

    if (!fs.existsSync(resolveUserDirectory)) {
      throw new Error(
        `User ${printer.name(
          username,
        )} could not be found, maybe the user is not logged in.`,
      )
    }

    //
    await fs.remove(configPaths.current)
    await fs.symlink(resolveUserDirectory, configPaths.current)
  }

  static async create(username: string): Promise<boolean> {
    const resolveUserDirectory = path.join(configPaths.users, username)

    //
    if (fs.existsSync(resolveUserDirectory)) {
      return false
    }

    //
    const resolveDefaultConfig = path.join(
      configPaths.users,
      ROOT_USER_DEFAULT_DIRECTORY,
    )

    if (!fs.existsSync(resolveDefaultConfig)) {
      warn('No default user found, creating new default profile...')

      //
      const defaultTemplatePath = paths.resolveRootTemplate(
        `users/${ROOT_USER_DEFAULT_DIRECTORY}`,
      )
      await fs.copy(defaultTemplatePath, resolveDefaultConfig)
    }

    //
    await fs.copy(resolveDefaultConfig, resolveUserDirectory)

    return true
  }

  static async delete(username: string): Promise<boolean> {
    const resolveUserDirectory = path.join(configPaths.users, username)
    if (!fs.existsSync(resolveUserDirectory)) {
      return false
    }

    //
    await fs.remove(resolveUserDirectory)

    return true
  }

  static async whoami(): Promise<{ id: string; username: string }> {
    const { id, username } = await this.readAuthentication()

    return { id, username }
  }

  static async initialize() {
    const resolveRootDirectory = paths.resolveRootDirectory()

    //
    const rootDirectoryIsEixsted = await fs.existsSync(resolveRootDirectory)
    if (!rootDirectoryIsEixsted) {
      info('Initializing the configuration directory in the local...')

      // Copy root directory from template
      // of current `@nuz/cli` version
      await fs.copy(paths.resolveRootTemplate(), resolveRootDirectory)
    }

    //
    const resolveNuzrcFile = await fs.existsSync(configPaths.current)
    if (!resolveNuzrcFile) {
      if (rootDirectoryIsEixsted) {
        warn(`Initializing current working directory in the local...`)
      }

      await this.use(ROOT_USER_DEFAULT_DIRECTORY)
    }
  }

  static async prepare(): Promise<void> {
    await this.initialize()
  }

  static async readConfiguration(
    resolvePath?: string,
  ): Promise<ConfigurationData> {
    return fs.readJson(resolvePath ?? configPaths.configuration)
  }

  static async writeConfiguration(data: ConfigurationData): Promise<any> {
    return fs.writeFile(
      configPaths.configuration,
      JSON.stringify(data, null, 2),
    )
  }

  static async readAuthentication(
    resolvePath?: string,
  ): Promise<AuthenticationData> {
    const authentication: AuthenticationData = await fs.readJson(
      resolvePath ?? configPaths.authentication,
    )

    if (authentication.loggedAt) {
      try {
        authentication.loggedAt = new Date(authentication.loggedAt)
        // tslint:disable-next-line: no-empty
      } catch {}
    }

    return authentication
  }

  static async writeAuthentication(data: AuthenticationData): Promise<any> {
    const updated = Object.assign({}, data)

    //
    if (updated.loggedAt instanceof Date) {
      Object.assign(updated, {
        loggedAt: updated.loggedAt.toUTCString() as any,
      })
    }

    return fs.writeFile(
      configPaths.authentication,
      JSON.stringify(updated, null, 2),
    )
  }

  static async requireAs(
    type?: UserAccessTokenTypes,
  ): Promise<AuthenticationData> {
    const authentication = await this.readAuthentication()

    //
    const { username, id, token, type: loggedType } = authentication

    if (username === ROOT_USER_DEFAULT_DIRECTORY) {
      throw new Error('You are not logged in, need to login to do this.')
    }

    if (!id || !token || !loggedType) {
      throw new Error(
        'Current configuration is invalid, user cannot be authenticated.',
      )
    }

    const isDenied = type && !accessTokenHelpers.verify(loggedType, type)
    if (isDenied) {
      throw new Error('You are not authorized to do this.')
    }

    return authentication
  }

  static async getUsersLogged(): Promise<any> {
    const match = glob.sync(path.join(configPaths.users, '*'))
    const users: {
      [username: string]: Pick<
        AuthenticationData,
        | AuthenticationFields.id
        | AuthenticationFields.username
        | AuthenticationFields.loggedAt
      >
    } = {}

    //
    for (const item of match) {
      const isDefault = /\/(default)$/.test(item)
      if (!isDefault) {
        const authentication = await this.readAuthentication(
          path.join(item, ROOT_USER_AUTHENTICATION_FILENAME),
        )
        const configuration = await this.readConfiguration(
          path.join(item, ROOT_USER_CONFIGURATION_FILENAME),
        )

        //
        Object.assign(users, {
          [authentication.username]: {
            id: authentication.id,
            username: authentication.username,
            loggedAt: authentication.loggedAt,
            configuration,
          },
        })
      }
    }

    return users
  }
}

export default Config
