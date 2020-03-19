const runScriptInContext = (code: string, context: any) => {
  const fn = new Function(code).bind(context)
  return fn()
}

export default runScriptInContext
