export interface DeferedPromise<T extends unknown> extends Promise<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: Error) => void
}

function deferedPromise<T extends unknown>(): DeferedPromise<T> {
  const defered = {} as DeferedPromise<T>

  defered.promise = new Promise((resolve, reject) => {
    defered.resolve = resolve
    defered.reject = reject
  })

  return defered
}

export default deferedPromise
