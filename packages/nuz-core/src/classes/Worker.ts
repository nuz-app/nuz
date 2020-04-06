type Fn = (...rest: any) => Promise<any>

class Worker {
  private readyPromise?: Promise<any>

  constructor(
    private readonly _setup: Fn,
    private readonly _teardown: Fn,
    private readonly _refresh: Fn,
  ) {}

  async ready() {
    return this.readyPromise
  }

  async setup() {
    this.readyPromise = this._setup()

    return this.readyPromise
  }

  async refresh() {
    await this._refresh()
  }

  async teardown() {
    await this._teardown()
  }
}

export default Worker
