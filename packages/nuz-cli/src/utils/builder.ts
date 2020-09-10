import webpack from 'webpack'

// eslint-disable-next-line @typescript-eslint/promise-function-async
function builder(config: any): Promise<any> {
  return new Promise((resolve) => {
    const compiler = webpack(config)
    compiler.run((error, stats) => resolve({ error, stats }))
  })
}

export default builder
