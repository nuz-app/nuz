import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/compose/collaborators',
    onRoute(async (request, response) => {
      const { compose } = request.query

      const formIsMissing = !compose
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }
      const item = await worker.getCollaboratorsOfCompose(
        compose as string,
      )

      response.json(item)
      return true
    }),
  )
}
