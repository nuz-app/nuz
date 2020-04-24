import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/module/collaborator',
    onRoute(async (request, response) => {
      const { token, module, collaboratorId } = request.body

      const formIsMissing = !token || !module || !collaboratorId
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.removeCollaboratorFromModule(
        token,
        module,
        collaboratorId,
      )

      response.json(item)
      return true
    }),
  )
}
