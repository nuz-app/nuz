import os from 'os'
import path from 'path'

import {
  NUZ_AUTH_FILENAME,
  NUZ_CONFIG_FILENAME,
  NUZ_DEFAULT_USERNAME,
} from '../lib/const'

import * as fs from '../utils/fs'
import * as paths from '../utils/paths'

type ConfigPaths = {
  home: string
  root: string
  nuzrc: string
  config: string
  auth: string
}

interface ConfigData {}

const pathsFactory = (): ConfigPaths => {
  const home = os.homedir()
  const root = path.join(os.homedir(), '.nuz')
  const nuzrc = path.join(root, '.nuzrc')

  const config = path.join(nuzrc, NUZ_CONFIG_FILENAME)
  const auth = path.join(nuzrc, NUZ_AUTH_FILENAME)

  return {
    home,
    root,
    nuzrc,
    config,
    auth,
  }
}

export enum ConfigKeys {
  registry = 'registry',
}

class Config {
  static readonly paths = pathsFactory()

  /**
   * Make a symlinks to use
   */
  static async use(username: string) {
    const configPath = path.join(this.paths.root, `users/${username}`)
    if (!fs.exists(configPath)) {
      throw new Error(`${username} is not exists in config`)
    }

    await fs.symlink(configPath, this.paths.nuzrc)
  }

  static async initial() {
    const rootTemplatePath = path.join(paths.tool + '/templates/root')
    await fs.copy(rootTemplatePath, this.paths.root)

    await this.use(NUZ_DEFAULT_USERNAME)
  }

  static async prepare() {
    const rootIsExisted = fs.exists(this.paths.root)
    if (!rootIsExisted) {
      await this.initial()
    }
  }

  static async readConfig(): Promise<ConfigData> {
    return fs.readJson(this.paths.config)
  }

  static async writeConfig(data: ConfigData): Promise<any> {
    return fs.writeJson(this.paths.config, data)
  }
}

export default Config
