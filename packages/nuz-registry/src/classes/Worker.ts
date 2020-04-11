import { Connection } from 'mongoose'

import { Models, MongoOptions } from '../types'

import { createModels } from '../models'
import { createServices, Services } from '../services'

import createMongoConnection from '../utils/createMongoConnection'

class Worker {
  private readonly connection: Connection
  private readonly models: Models
  private readonly services: Services

  constructor(options: MongoOptions) {
    const { url } = options

    if (!url) {
      throw new Error('Mongo URL is required!')
    }

    this.connection = createMongoConnection(url)
    this.models = createModels(this.connection)
    this.services = createServices(this.models)
  }

  async prepare() {}

  /**
   * Operations management Module
   */
  async publishModule() {}
  async unpublishModule() {}
  async deprecateModule() {}
  async setTagForModule() {}
  async addCollaboratorToModule() {}
  async removeCollaboratorToModule() {}

  /**
   * Operations management User
   */
  async createUser() {}
  async updateUser() {}
  async authUser() {}
  async verifyUser() {}

  /**
   * Operations management Composition
   */
  async createComposition() {}
  async deleteComposition() {}
  async addCollaboratorToComposition() {}
  async removeCollaboratorToComposition() {}
  async addModulesToComposition() {}
  async removeModulesToComposition() {}
}

export default Worker
