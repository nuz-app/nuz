import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/composition/collaborators',
    onRoute(async (request, response) => {
      const { composition } = request.body

      const formIsMissing = !composition
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }
      const item = await worker.getCollaboratorsOfComposition(composition)

      response.json(item)
      return true
    }),
  )
}
