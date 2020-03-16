export type DeferedPromise<T = unknown> = Promise<T> & {
  resolve: (...rest: any) => void
  reject: (error?: Error) => void
}

const deferedPromise = <T>(): DeferedPromise<T> => {
  const promise = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      promise.resolve = resolve
      promise.reject = reject
    }, 0)
  }) as DeferedPromise<T>

  return promise
}

export default deferedPromise
