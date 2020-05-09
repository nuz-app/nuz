import { assetsUrlHelpers } from '@nuz/utils'

import aws from 'aws-sdk'
import fs from 'fs'
import throat from 'throat'
import util from 'util'

import { ModuleId } from '../types'
import { TransformFile } from '../utils/validateAndTransformFiles'

import Storage, { UploadFilesData } from './Storage'

const PERMISSION_FILE_UPLOAD = 'public-read'
const PROMISES_LIMIT = 4

const readFile = util.promisify(fs.readFile)

export interface DigitalOceanStorageConfig {
  origin: string
  endpoint: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
}

class DigitalOceanStorage implements Storage {
  private readonly _bucket: string
  private readonly _origin: string
  private readonly _s3: aws.S3

  constructor(config: DigitalOceanStorageConfig) {
    const { origin, endpoint, bucket, accessKeyId, secretAccessKey } = config

    if (!origin) {
      throw new Error(
        // tslint:disable-next-line: prettier
        'Can\'t be initial DigitalOceanStorage because missing `origin` value',
      )
    }

    if (!endpoint) {
      throw new Error(
        // tslint:disable-next-line: prettier
        'Can\'t be initial DigitalOceanStorage because missing `endpoint` value',
      )
    }

    if (!bucket) {
      throw new Error(
        // tslint:disable-next-line: prettier
        'Can\'t be initial DigitalOceanStorage because missing `bucket` value',
      )
    }

    if (!accessKeyId) {
      throw new Error(
        // tslint:disable-next-line: prettier
        'Can\'t be initial DigitalOceanStorage because missing `accessKeyId` value',
      )
    }

    if (!secretAccessKey) {
      throw new Error(
        // tslint:disable-next-line: prettier
        'Can\'t be initial DigitalOceanStorage because missing `secretAccessKey` value',
      )
    }

    this._origin = origin
    this._bucket = bucket
    this._s3 = new aws.S3({
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

    const promises = Promise.all(
      files.map(
        throat(PROMISES_LIMIT, async (file) =>
          this._s3
            .upload({
              ACL: PERMISSION_FILE_UPLOAD,
              Bucket: this._bucket,
              ContentType: file.mimeType,
              Key: file.key,
              Body: await readFile(file.tempPath),
            })
            .promise(),
        ),
      ),
    )

    return promises
  }

  async createUrl(moduleId: ModuleId, version: string, filename: string) {
    return assetsUrlHelpers.create(moduleId, version, filename, this._origin)
  }
}

export default DigitalOceanStorage
