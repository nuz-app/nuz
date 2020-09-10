// import webpack from 'webpack'

// export type AllowWebpackConfig = webpack.Configuration | webpack.Configuration[]

// export const get = (config: AllowWebpackConfig) => webpack(config as any)

// export const run = (config: AllowWebpackConfig): Promise<webpack.Stats> =>
//   new Promise((resolve, reject) => {
//     const compiler = get(config)
//     compiler.run((error, stats) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(stats)
//       }
//     })
//   })

// export function watch (
//   config: AllowWebpackConfig,
//   callback: webpack.ICompiler.Handler,
// ): Promise<webpack.Compiler.Watching> {
//   return new Promise((resolve) => {
//     const compiler = get(config);
//     const watcher = compiler.watch(
//       {
//         aggregateTimeout: 500,
//         poll: 500,
//         ignored: ["node_modules/**"],
//       },
//       callback
//     );

//     return resolve(watcher);
//   });
// }
