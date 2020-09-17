import { assetsUrlHelpers } from '@nuz/utils'
import type aws from 'aws-sdk'
import fs from 'fs'
import throat from 'throat'
import util from 'util'

import { ModuleId } from '../types'
import { TransformFile } from '../utils/ensureUploadedFiles'

import Storage, { UploadFilesData } from './Storage'

const REQUIRE_UPLOAD_PERMISSION = 'public-read'
const PROMISES_LIMIT = 5
const REQUIRE_FIELDS = [
  'origin',
  'origin',
  'bucket',
  'accessKeyId',
  'secretAccessKey',
]

const readFileAsync = util.promisify(fs.readFile)

export interface DigitalOceanStorageConfig {
  origin: string
  endpoint: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
}

class DigitalOceanStorage implements Storage {
  private readonly bucket: string
  private readonly cdn: string
  private readonly s3: aws.S3

  constructor(config: DigitalOceanStorageConfig) {
    const { origin, endpoint, bucket, accessKeyId, secretAccessKey } = config

    for (const field of REQUIRE_FIELDS) {
      if (!config[field]) {
        throw new Error(
          `Cannot initialize Storage because ${field} field is missing.`,
        )
      }
    }

    let awsKit
    try {
      awsKit = require('aws-sdk')
    } catch {
      throw new Error('Worker is not ofund, please install `aws-sdk` to use.')
    }

    this.cdn = origin
    this.bucket = bucket
    this.s3 = new awsKit.S3({
      endpoint,
      accessKeyId,
      secretAccessKey,
    })
  }

  // tslint:disable-next-line: no-empty
  async prepare() {}

  async uploadFiles(data: UploadFilesData, files: TransformFile[]) {
    const { id, version } = data

    if (!id || !version) {
      throw new Error(
        `Can't upload files because missing module id or version!`,
      )
    }

    return Promise.all(
      files.map(
        throat(PROMISES_LIMIT, async (file) =>
          this.s3
            .upload({
              ACL: REQUIRE_UPLOAD_PERMISSION,
              Bucket: this.bucket,
              ContentType: file.mimeType,
              Key: file.key,
              Body: await readFileAsync(file.tempPath),
            })
            .promise(),
        ),
      ),
    )
  }

  async createUrl(
    moduleId: ModuleId,
    version: string,
    filename: string,
  ): Promise<string> {
    return assetsUrlHelpers.create(moduleId, version, filename, this.cdn)
  }
}

export default DigitalOceanStorage
