import { Express } from 'express'

import Worker from '../classes/Worker'
import convertObjectToMap from '../utils/convertObjectToMap'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'addModulesToComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/composition/modules',
    onRoute(async (request, response) => {
      const { token, composition, modules: moduleAsObj } = request.body

      const formIsMissing = !token || !composition || !moduleAsObj
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const modules = convertObjectToMap(moduleAsObj)
      const modulesIsInvalid = modules.size === 0
      if (modulesIsInvalid) {
        throw new Error('Modules is invalid')
      }

      const item = await worker.addModulesToComposition(
        token,
        composition,
        modules,
      )

      response.json(item)
      return true
    }),
  )
}
