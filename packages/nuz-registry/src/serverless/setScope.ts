import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

export default (app: Express, db: ModelDB) => {
  app.post('/permission/scope', async (request, response) => {
    const { authorization } = request.headers
    const { token, scope } = request.body

    const item = await db.setScope(authorization, token, scope)

    response.json(item)
    return true
  })
}
