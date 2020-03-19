import express from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'setScope'

export const execute = (app: express.Express, db: ModelDB) => {
  app.post(
    '/permission/scope',
    onRoute(
      async (
        request: express.Request,
        response: express.Response,
      ): Promise<boolean> => {
        const { authorization } = request.headers
        const { token, scope } = request.body

        const item = await db.setScope(authorization, token, scope)

        response.json(item)
        return true
      },
    ),
  )
}
