import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user',
    wrapRoute(async function (request, response) {
      const { data } = request.body

      if (!data) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.createUser(data)

      //
      response.json(result)

      return true
    }),
  )
}
