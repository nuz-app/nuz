import { got } from '@nuz/utils'

import _get from 'lodash/get'

import { PublishConfig } from '../../types'

const publish = ({ endpoint, token }: PublishConfig, info, options) =>
  got({ method: 'get', url: endpoint, data: { token, info, options } })

export default publish
