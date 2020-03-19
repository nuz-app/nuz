import http from 'http'
import handler from 'serve-handler'

const serve = ({ port, dir }: { port: number; dir: string }): http.Server => {
  const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Request-Method', '*')
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    response.setHeader('Access-Control-Allow-Headers', '*')

    return handler(request, response, {
      public: dir,
      symlinks: true,
      etag: true,
    })
  })

  return server.listen(port)
}

export default serve
