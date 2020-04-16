import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeModulesFromComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/composition/modules',
    onRoute(async (request, response) => {
      const { token, composition, modules } = request.body

      const formIsMissing = !token || !composition || !modules
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const modulesIsInvalid = !Array.isArray(modules) || modules.length === 0
      if (modulesIsInvalid) {
        throw new Error('Modules is invalid')
      }

      const item = await worker.removeModulesFromComposition(
        token,
        composition,
        modules,
      )

      response.json(item)
      return true
    }),
  )
}
