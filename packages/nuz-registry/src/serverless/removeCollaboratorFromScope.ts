import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/scope/collaborator',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { scope, collaboratorId } = request.body

      const formIsMissing = !token || !scope || !collaboratorId
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.removeCollaboratorFromScope(
        token as string,
        scope,
        collaboratorId,
      )

      response.json(item)
      return true
    }),
  )
}
