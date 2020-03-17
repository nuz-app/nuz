class DeferedPromise<T = unknown> extends Promise<T> {
  resolve: any
  reject: any

  constructor() {
    super((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default DeferedPromise
