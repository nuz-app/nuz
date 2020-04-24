import axios, { AxiosRequestConfig } from 'axios'

import * as jsonHelpers from './jsonHelpers'

const got = async (config: AxiosRequestConfig): Promise<any> => {
  try {
    const response = await axios(config)
    return response
  } catch (error) {
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      if (error.response.data?.error?.message) {
        throw new Error(error.response.data.error.message)
      }

      throw new Error(
        `There was an error returning from the server, details: ${jsonHelpers.stringify(
          error.response.data?.error,
        )}`,
      )
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      throw new Error(error.request)
    }

    throw new Error(error.message)
  }
}

export default got
