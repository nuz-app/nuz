import { Express } from 'express'
import ModelDB from '../classes/ModelDB'

export default (app: Express, db: ModelDB) => {
  app.get('/', async (request, response) => {
    const config = await db.getConfig()

    response.json(config)
    return true
  })
}
