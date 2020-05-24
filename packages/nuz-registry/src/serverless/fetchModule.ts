import { Express } from 'express'

import { LASTEST_TAG } from '../lib/const'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'fetchModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/fetch/module',
    onRoute(async (request, response) => {
      // tslint:disable-next-line: prefer-const
      let { id, module, version } = request.query

      if (id) {
        // tslint:disable-next-line: semicolon
        ;[module, version] = ((id as string) || '').split('@')
      }

      if (id && !version) {
        version = LASTEST_TAG
      }

      const item = await worker.fetchModule(module as string, version as string)
      response.json(item)

      return true
    }),
  )
}
