import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'loginUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user/login',
    onRoute(async (request, response) => {
      const { username, password } = request.body

      const formIsMissing = !username || !password
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.loginUser(username, password)

      response.json(item)
      return true
    }),
  )
}
