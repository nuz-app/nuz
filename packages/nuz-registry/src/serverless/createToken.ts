import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

export default (app: Express, db: ModelDB) => {
  app.post('/token', async (request, response) => {
    const { authorization } = request.headers
    const { scope } = request.body

    const item = await db.createToken(authorization, scope)

    response.json(item)
    return true
  })
}
