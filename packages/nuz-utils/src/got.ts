import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export type GotRequestConfig = AxiosRequestConfig

export type GotResponse<T = any> = AxiosResponse<T>

async function got<R = GotResponse<any>>(
  config: AxiosRequestConfig,
): Promise<R> {
  try {
    const response = await axios(config)

    return response as any
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
        `There was an error returning from the server, details: ${JSON.stringify(
          error.response.data?.error ?? error.response.data ?? error.response,
        )}. #${
          (error.response.data?.error && '1') || error.response.data ? 2 : 3
        }.`,
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
