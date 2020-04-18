export interface DeferedPromise<T> extends Promise<T> {
  promise: Promise<any>
  resolve: (value: T) => void
  reject: (error: Error) => void
}

const deferedPromise = <T = unknown>() => {
  const defered = {} as DeferedPromise<T>

  defered.promise = new Promise((resolve, reject) => {
    defered.resolve = resolve
    defered.reject = reject
  })

  return defered
}

export default deferedPromise
