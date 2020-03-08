import { got } from '@nuz/utils'

import _get from 'lodash/get'

import { PublishConfig } from '../../types'
import * as apiUrls from '../../utils/apiUrls'

const publish = ({ endpoint, token }: PublishConfig, info, options) =>
  got(
    Object.assign(apiUrls.publishModule(endpoint), {
      data: { token, info, options },
    }),
  )

export default publish
