import { jsonHelpers } from '@nuz/utils'
import { Express } from 'express'
import fs from 'fs'
import multer from 'multer'
import os from 'os'
import path from 'path'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessConfig, ServerlessRoute } from './types'

export const name = 'publishModule'

export const execute: ServerlessRoute = (
  app: Express,
  worker: Worker,
  config: ServerlessConfig,
) => {
  const tmpDir = config.dev
    ? path.join(fs.realpathSync(process.cwd()), 'tmp')
    : os.tmpdir()
  const upload = multer({
    dest: tmpDir,
  })

  const cleanUp = (files: any[]) =>
    (files || []).forEach((file) =>
      fs.unlink(
        file.tempPath,
        (error) =>
          error &&
          console.warn(`Can't unlink temporary file at ${file.tempPath}`),
      ),
    )

  const onFiles = upload.array('files')
  const onPublish = onRoute(async (request, response) => {
    const { authorization: token } = request.headers
    const { module: id, data: _data, options: _options } = request.body

    const data = jsonHelpers.parse(_data)
    const options = jsonHelpers.parse(_options) || {}
    const files = (request as any).files.map((item) =>
      Object.assign(item, { path: undefined, tempPath: item.path }),
    )

    const formIsMissing = !token || !id || !data
    if (formIsMissing) {
      cleanUp(files)
      throw new Error('Form is missing fields')
    }

    try {
      const item = await worker.publishModule(
        token as string,
        id,
        data,
        files,
        options,
      )

      cleanUp(files)
      response.json(item)
    } catch (error) {
      cleanUp(files)
      throw error
    }

    return true
  })

  app.put('/module', onFiles, onPublish)
}
