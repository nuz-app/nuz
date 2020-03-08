import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

export default (app: Express, db: ModelDB) => {
  app.post('/module', async (request, response) => {
    const { token, info } = request.body

    const item = await db.publishModule(token, info, {})

    response.json(item)
    return true
  })
}
