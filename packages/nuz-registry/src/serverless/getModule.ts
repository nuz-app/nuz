import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/module',
    onRoute(async (request, response) => {
      const { module: id, fields } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing module id')
      }
      const item = await worker.getModule(id as string, fields)

      response.json({ module: item })
      return true
    }),
  )
}
