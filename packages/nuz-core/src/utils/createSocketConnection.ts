function createSocketConnection(url: URL): any {
  let io
  try {
    io = require('socket.io-client')
  } catch {
    throw new Error(
      'Please install `socket.io-client` to use linked modules feature',
    )
  }

  return io.connect(url.origin, {
    path: url.pathname,
  })
}

export default createSocketConnection
