import * as shared from '../shared'

import * as server from './server'

export interface NextFactoryConfig {
  require: NodeRequire
  autoInject?: boolean
}

export function integrate(config: NextFactoryConfig) {
  const { require, autoInject = true } = config || {}

  if (!require) {
    throw new Error('`require` is required in config, please provide to use')
  }

  function withNuz(nextConfig: any = {}) {
    return Object.assign({}, nextConfig, {
      webpack: (webpackConfig, { isServer, ...rest }) => {
        const webpackCustom = nextConfig.webpack
        const updatedConfig = !webpackCustom
          ? webpackConfig
          : webpackCustom(webpackConfig, { isServer, ...rest })

        if (!isServer) {
          if (!updatedConfig.node) {
            updatedConfig.node = {}
          }

          const useNodeBuiltins = ['child_process', 'fs', 'net']
          useNodeBuiltins.forEach((builtins) => {
            updatedConfig.node[builtins] = !updatedConfig.node[builtins]
              ? 'empty'
              : updatedConfig.node[builtins]
          })
        }

        return updatedConfig
      },
    })
  }

  function injectNext() {
    server.prepare()

    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)
    Object.assign(nextServerRender, {
      renderToHTML: async function injectedRenderToHTML() {
        await server.setup()

        const html = await renderToHTML.apply(this, arguments)
        const result = shared.extractor.appendTagsToHTML(html)

        await server.teardown()

        return result
      },
    })
  }

  if (autoInject) {
    injectNext()
  }

  return { withNuz, injectNext }
}
