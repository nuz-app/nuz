import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deleteCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { compose } = request.body

      const formIsMissing = !token || !compose
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.deleteCompose(token as string, compose)

      response.json(item)
      return true
    }),
  )
}
