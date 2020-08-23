import * as shared from '../shared'

import * as server from './server'

export interface NextFactoryConfiguration {
  require: NodeRequire
  inject?: boolean
}

export function integrate(
  configuration: NextFactoryConfiguration,
): {
  withNuz: <C extends unknown>(nextConfiguration?: C) => C
  inject: () => void
} {
  const { require, inject } = Object.assign({ inject: true }, configuration)

  if (!require) {
    throw new Error('Pass the `require` function to integrate with Next.js')
  }

  function withNuz<C extends unknown>(nextConfiguration: C = {} as C): C {
    return Object.assign({}, nextConfiguration, {
      webpack: (webpackConfiguration: any, otherConfiguration: any) => {
        const { isServer } = otherConfiguration

        // Check and use if next configuration defined webpack field
        const isDefinedWebpack = !!(nextConfiguration as any).webpack

        const updatedConfiguration = isDefinedWebpack
          ? (nextConfiguration as any).webpack(
              webpackConfiguration,
              otherConfiguration,
            )
          : webpackConfiguration

        if (!isServer) {
          if (!updatedConfiguration.node) {
            updatedConfiguration.node = {}
          }

          const useNodeBuiltins = ['child_process', 'fs', 'net']
          useNodeBuiltins.forEach((builtins) => {
            updatedConfiguration.node[builtins] = !updatedConfiguration.node[
              builtins
            ]
              ? 'empty'
              : updatedConfiguration.node[builtins]
          })
        }

        return updatedConfiguration
      },
    })
  }

  function injectNext(): void {
    server.prepare()

    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)
    Object.assign(nextServerRender, {
      renderToHTML: async function injectedRenderToHTML() {
        await server.setup()

        const html = await renderToHTML.apply(this, arguments)
        const result = shared.extractor.appendIntoDocument(html)

        await server.teardown()

        return result
      },
    })
  }

  if (inject) {
    injectNext()
  }

  return { withNuz, inject: injectNext }
}
