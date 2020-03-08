import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'deleteToken'

export const execute = (app: Express, db: ModelDB, options) => {
  app.delete(
    '/token',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token } = request.body

      console.log({ authorization, token })

      const item = await db.deleteToken(authorization, token)

      response.json(item)
      return true
    }),
  )
}
