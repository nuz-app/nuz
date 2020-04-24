import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deprecateModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/module/deprecate',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { module, version, deprecate } = request.body

      const formIsMissing = !token || !module || !version || !deprecate
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.deprecateModule(
        token as string,
        module,
        version,
        deprecate,
      )

      response.json(item)
      return true
    }),
  )
}
