import express from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'setScope'

export const execute = (app: express.Express, worker: Worker) => {
  app.post(
    '/permission/scope',
    onRoute(
      async (
        request: express.Request,
        response: express.Response,
      ): Promise<boolean> => {
        const { authorization } = request.headers
        const { token, scope } = request.body

        const item = await worker.setScope(authorization, token, scope)

        response.json(item)
        return true
      },
    ),
  )
}
