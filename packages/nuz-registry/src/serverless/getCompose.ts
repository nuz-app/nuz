import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'getCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/compose',
    wrapRoute(async function (request, response) {
      const { compose: id, fields } = request.query

      if (!id) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.getCompose(id as string, fields)

      //
      response.json({ compose: result })

      return true
    }),
  )
}
