import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'publishModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/module',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { module: id, data, options = {} } = request.body

      const formIsMissing = !token || !id || !data
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.publishModule(
        token as string,
        id,
        data,
        options,
      )

      response.json(item)
      return true
    }),
  )
}
