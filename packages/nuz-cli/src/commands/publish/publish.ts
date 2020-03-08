import axios from 'axios'

import { PublishConfig } from '../../types'

const publish = async (config: PublishConfig, info) => {
  const { token, endpoint } = config

  const { statusText, data, response } = await axios
    .post(endpoint, {
      token,
      info,
    })
    .catch(e => e)

  if (statusText === 'OK') {
    return data
  }

  throw new Error(
    response.data.error.message ||
      'Have an error while publish version for module',
  )
}

export default publish
