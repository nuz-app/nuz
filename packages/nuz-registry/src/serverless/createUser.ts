import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user',
    onRoute(async (request, response) => {
      const { data } = request.body

      const formIsMissing = !data
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.createUser(data)

      response.json(item)
      return true
    }),
  )
}
