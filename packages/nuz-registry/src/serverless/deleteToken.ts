import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

export default (app: Express, db: ModelDB) => {
  app.delete('/token', async (request, response) => {
    const { authorization } = request.headers
    const { token } = request.body

    console.log({ authorization, token })

    const item = await db.deleteToken(authorization, token)

    response.json(item)
    return true
  })
}
