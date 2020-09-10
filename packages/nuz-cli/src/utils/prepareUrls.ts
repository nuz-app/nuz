import {
  Urls,
  choosePort,
  prepareUrls as basePrepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils'

export interface PrepareUrlsConfig {
  protocol: string
  host: string
  port: number
}

async function prepareUrls(
  config: PrepareUrlsConfig,
): Promise<Urls & { port: number; host: string }> {
  const { protocol, host, port: _port } = config

  // We attempt to use the default port but if it is busy, we offer the user to
  // run on a different port. `choosePort()` Promise resolves to the next free port.
  const port = await choosePort(host, _port)
  if (port === null) {
    // We have not found a port.
    throw new Error('Not found a port to prepare urls')
  }

  const urls = basePrepareUrls(protocol, host, port)

  return Object.assign({ port, host }, urls)
}

export default prepareUrls
