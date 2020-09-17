import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'fetchCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/fetch/compose',
    wrapRoute(async function (request, response) {
      const { compose } = request.query

      if (!compose) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.fetchCompose(compose as string)

      //
      response.json(result)

      return true
    }),
  )
}
