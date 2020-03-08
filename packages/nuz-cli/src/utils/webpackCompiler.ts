import webpack from 'webpack'

export const get = (config: webpack.Configuration) => webpack(config)

export const run = (config: webpack.Configuration) =>
  new Promise((resolve, reject) => {
    const compiler = get(config)
    compiler.run((error, stats) => {
      if (error) {
        reject(error)
      } else {
        resolve(stats)
      }
    })
  })

export const watch = (config: webpack.Configuration, callback) =>
  new Promise(resolve => {
    const compiler = get(config)
    const watching = compiler.watch(
      {
        aggregateTimeout: 500,
        poll: 500,
        ignored: ['node_modules/**'],
      },
      callback,
    )

    return resolve(watching)
  })
