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

  values(): V[] {
    return Array.from(this._data.values())
  }

  entries(): [K, V][] {
    return Array.from(this._data.entries())
  }

  clear() {
    return this._data.clear()
  }
}

export default Caches
