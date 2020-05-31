import ignoredFiles from 'react-dev-utils/ignoredFiles'
import WebpackDevServer from 'webpack-dev-server'

const host = process.env.HOST || 'localhost'
const sockHost = process.env.WDS_SOCKET_HOST
const sockPath = process.env.WDS_SOCKET_PATH // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT

export default function devServerConfigFactory({
  dir,
  contentBase,
  publicUrlOrPath,
}): WebpackDevServer.Configuration {
  const ignored = ignoredFiles(dir)

  return {
    // Enable gzip compression of generated files
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'silent',
    // https://webpack.js.org/configuration/dev-server/#devservercontentbase
    contentBase,
    // By default files from `contentBase` will not trigger a page reload
    watchContentBase: true,
    // Enable webpack's Hot Module Replacement
    hot: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    // Host config
    sockHost,
    sockPath,
    sockPort,
    host,
    serveIndex: true,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // Shows a full-screen overlay in the browser when there are compiler errors or warnings
    overlay: {
      warnings: true,
      errors: true,
    },
    historyApiFallback: false,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    watchOptions: {
      ignored,
      poll: true,
    },
    // The bundled files will be available in the browser under this path
    publicPath: publicUrlOrPath.slice(0, -1),
    // Write generated assets to the disk
    writeToDisk: false,
    // Not show build info
    noInfo: true,
    // Allow cors
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  }
}
