import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deleteScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/scope',
    onRoute(async (request, response) => {
      const { token, scope } = request.body

      const formIsMissing = !token || !scope
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.deleteScope(token, scope)

      response.json(item)
      return true
    }),
  )
}
