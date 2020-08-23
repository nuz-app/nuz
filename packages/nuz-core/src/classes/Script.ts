class Script {
  static executeOnBrowser<T extends unknown>(code: string, context: T): T {
    const caller = new Function(code).bind(context)
    caller.apply(this, [])

    return context
  }

  static executeOnNode<T extends unknown>(code: string, context: T): T {
    const vm = require('vm')
    vm.createContext(context)
    vm.runInContext(code, context)

    return context
  }
}

export default Script
