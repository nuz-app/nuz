export interface DeferedPromise<T> extends Promise<T> {
  ready: Promise<any>
  resolve: (...rest: any[]) => void
  reject: (...rest: any[]) => void
}

const tick = () => new Promise(resolve => setTimeout(resolve, 1))

const deferedPromise = <T = unknown>() => {
  const promise = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      promise.resolve = resolve
      promise.reject = reject
    }, 0)
  }) as DeferedPromise<T>

  promise.ready = tick()

  return promise
}

export default deferedPromise
