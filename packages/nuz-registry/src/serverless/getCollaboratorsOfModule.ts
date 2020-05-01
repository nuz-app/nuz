import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/module/collaborators',
    onRoute(async (request, response) => {
      const { module: id } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }
      const item = await worker.getCollaboratorsOfModule(id as string)

      response.json(item)
      return true
    }),
  )
}
