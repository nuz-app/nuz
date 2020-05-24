type Fn = (...rest: any) => Promise<any>

class Worker {
  private _ready?: Promise<any>

  constructor(
    private readonly _setup: Fn,
    private readonly _teardown: Fn,
    private readonly _refresh: Fn,
  ) {}

  async ready() {
    return this._ready
  }

  async setup() {
    return (this._ready = this._setup())
  }

  async refresh() {
    return this._refresh()
  }

  async teardown() {
    return this._teardown()
  }
}

export default Worker
