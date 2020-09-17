import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'createCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/compose',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { data } = request.body

      if (!token || !data) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.createCompose(token as string, data)

      //
      response.json(result)

      return true
    }),
  )
}
