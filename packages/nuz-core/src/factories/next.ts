import * as shared from '../shared'

import { extractorHelpers, inject, Loadable } from './react'

export interface NextFactoryConfig {
  require: NodeRequire
  autoInject?: boolean
}

function nextIntegrate(config: NextFactoryConfig) {
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
    inject({
      react: require('react'),
      'react-dom': require('react-dom'),
    })

    shared.extractor.prepare({
      parser: extractorHelpers.parser,
      renderer: extractorHelpers.renderer,
    })

    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)
    Object.assign(nextServerRender, {
      renderToHTML: async function injectedRenderToHTML() {
        await Promise.all([
          shared.process.ready(),
          shared.extractor.setup(),
          Loadable.preloadAll(),
        ])

        const html = await renderToHTML.apply(this, arguments)
        const result = shared.extractor.appendTagsToHTML(html)

        await Promise.all([
          shared.process.closeSession(),
          shared.extractor.teardown(),
          shared.process.checkUpdate(() => Loadable.flushAll()),
        ])

        return result
      },
    })
  }

  if (autoInject) {
    injectNext()
  }

  return { withNuz, injectNext }
}

export default nextIntegrate
