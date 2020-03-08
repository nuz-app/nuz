const runScriptInContext = (code, context) => {
  const fn = new Function(code).bind(context)
  return fn()
}

export default runScriptInContext
