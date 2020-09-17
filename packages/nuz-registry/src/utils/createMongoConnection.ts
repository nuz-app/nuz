import mongoose from 'mongoose'

function createMongoConnection(
  url: string,
  options?: mongoose.ConnectionOptions,
) {
  const conn = mongoose.createConnection(
    url,
    Object.assign(
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      options,
    ),
  )

  conn.once('open', function () {
    console.log('[db]', 'Ready')
  })

  conn.on('error', function (error: Error) {
    const isNetworkError = error.name === 'MongoNetworkError'
    console.error('[db]', 'An error occurred!')

    if (isNetworkError) {
      console.log('[db]', 'Please make sure mongodb is turned on and working!')
    }
  })

  conn.on('connected', function () {
    console.log('[db]', 'Connected')
  })

  conn.on('reconnected', function () {
    console.log('[db]', 'Reconnected')
  })

  conn.on('disconnected', function () {
    console.log('[db]', 'Disconnected')
  })

  return conn
}

export default createMongoConnection
