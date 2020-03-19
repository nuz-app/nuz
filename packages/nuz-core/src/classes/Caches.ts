class Caches<K = string, V = unknown> {
  private readonly _data: Map<K, V>

  constructor(init?: [K, V][]) {
    this._data = new Map(init)
  }

  set(key: K, value: V) {
    this._data.set(key, value)
  }

  has(key: K) {
    return this._data.has(key)
  }

  get(key: K) {
    return this._data.get(key)
  }
}

export default Caches
