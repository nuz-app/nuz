import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/scope/collaborators',
    onRoute(async (request, response) => {
      const { scope } = request.body

      const formIsMissing = !scope
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }
      const item = await worker.getCollaboratorsOfScope(scope)

      response.json(item)
      return true
    }),
  )
}
