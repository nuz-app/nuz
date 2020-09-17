import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'loginUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user/login',
    onRoute(async function (request, response) {
      const { username, password } = request.body

      if (!username || !password) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.loginUser(username, password)
      const config = await worker.getConfig()

      //
      response.json(Object.assign({}, result, config))

      return true
    }),
  )
}
