import { compareFilesByHash } from '@nuz/utils'
import fs from 'fs'
import path from 'path'

import * as bootstrap from '../bootstrap'

import { injectReactDOMFactory } from './react'

export interface NextFactoryConfig {
  require: NodeRequire
  autoInject?: boolean
}

const LOADABLE_UPDATED_PATH = path.join(
  __dirname,
  '../../bundled/next/loadable.js',
)

const LOADABLE_REQUIRE_PATH = 'next/dist/next-server/lib/loadable'

function nextIntegrate(config: NextFactoryConfig) {
  const { require, autoInject = true } = config || {}

  if (!require) {
    throw new Error('`require` is required in config, please provide to use')
  }

  const loadablePath = require.resolve(LOADABLE_REQUIRE_PATH)

  // Replace loadable file of Next.js
  const fileIsDiff = !compareFilesByHash(LOADABLE_UPDATED_PATH, loadablePath)
  if (fileIsDiff) {
    fs.copyFileSync(LOADABLE_UPDATED_PATH, loadablePath)
  }

  function withNuz(nextConfig: any = {}) {
    return Object.assign({}, nextConfig, {
      webpack: (webpackConfig: any, { isServer, ...rest }: any) => {
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
    injectReactDOMFactory(require('react-dom'))()

    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)
    Object.assign(nextServerRender, {
      renderToHTML: async function injectedRenderToHTML() {
        await bootstrap.process.ready()
        const html = await renderToHTML.apply(this, arguments)
        await bootstrap.process.flush()

        bootstrap.process.refresh()
        console.log('called before send html to client')

        return html
      },
    })
  }

  if (autoInject) {
    injectNext()
  }

  return { withNuz, injectNext }
}

export default nextIntegrate
