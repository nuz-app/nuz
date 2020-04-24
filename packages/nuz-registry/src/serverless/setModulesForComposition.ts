import { checkIsObject } from '@nuz/utils'
import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'setModulesForComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/composition/modules',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { composition, modules: moduleAsObject } = request.body

      const formIsMissing = !token || !composition || !moduleAsObject
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const modulesIsInvalid = !checkIsObject(moduleAsObject)
      if (modulesIsInvalid) {
        throw new Error('Modules is invalid')
      }

      const item = await worker.setModulesForComposition(
        token as string,
        composition,
        moduleAsObject,
      )

      response.json(item)
      return true
    }),
  )
}
