import { loadLocalCertificate } from '@nuz/utils'
import type express from 'express'
import http from 'http'
import spdy from 'spdy'

import { HttpsConfiguration } from '../types'

function createServerForApplication(
  application: express.Application,
  https: boolean | HttpsConfiguration,
): spdy.Server | http.Server {
  if (https) {
    return spdy.createServer(
      https === true ? Object.assign({}, loadLocalCertificate()) : https,
      application,
    )
  }

  return http.createServer(application)
}

export default createServerForApplication
