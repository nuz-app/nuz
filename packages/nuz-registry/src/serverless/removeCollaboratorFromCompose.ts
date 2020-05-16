import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose/collaborator',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { compose, collaboratorId } = request.body

      const formIsMissing = !token || !compose || !collaboratorId
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.removeCollaboratorFromCompose(
        token as string,
        compose,
        collaboratorId,
      )

      response.json(item)
      return true
    }),
  )
}
