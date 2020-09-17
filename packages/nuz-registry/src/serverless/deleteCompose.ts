import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deleteCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { compose } = request.body

      if (!token || !compose) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.deleteCompose(token as string, compose)

      //
      response.json(result)

      return true
    }),
  )
}
