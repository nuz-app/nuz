import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/composition/collaborator',
    onRoute(async (request, response) => {
      const { token, composition, collaboratorId } = request.body

      const formIsMissing = !token || !composition || !collaboratorId
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.removeCollaboratorFromComposition(
        token,
        composition,
        collaboratorId,
      )

      response.json(item)
      return true
    }),
  )
}
