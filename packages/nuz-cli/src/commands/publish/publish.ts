import { got } from '@nuz/utils'

import _get from 'lodash/get'

import { RegistryConfig } from '../../types'
import * as apiUrls from '../../utils/apiUrls'

const publish = (
  { endpoint, token }: RegistryConfig,
  info: any,
  options: any,
) =>
  got(
    Object.assign(apiUrls.publishModule(endpoint), {
      data: { token, info, options },
    }),
  )

export default publish
