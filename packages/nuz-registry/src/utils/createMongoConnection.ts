import mongoose from 'mongoose'

const createMongoConnection = (url: string, options?) => {
  const conn = mongoose.createConnection(
    url,
    Object.assign(
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      options,
    ),
  )

  conn.once('open', () => {
    console.log('[db]', 'Ready')
  })

  conn.on('error', (error: Error) => {
    const isNetworkError = error.name === 'MongoNetworkError'
    console.error('[db]', 'An error occurred!')

    if (isNetworkError) {
      console.log('[db]', 'Please make sure mongodb is turned on and working!')
    }
  })

  conn.on('connected', () => {
    console.log('[db]', 'Connected')
  })

  conn.on('reconnected', () => {
    console.log('[db]', 'Reconnected')
  })

  conn.on('disconnected', () => {
    console.log('[db]', 'Disconnected')
  })

  return conn
}

export default createMongoConnection
