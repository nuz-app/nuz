import React from 'react'
import ReactDOM from 'react-dom'
import { bootstrap, reactHelpersFactory, ModuleFormats } from '@nuz/core'
import Head from 'next/head'

const { App } = reactHelpersFactory({
  React, 
  ReactDOM,
})

bootstrap({
  ssr: true,
  linked: {
    port: 4000,
  },
  vendors: {
    'react': React,
    'react-dom': ReactDOM,
  },
  modules: {
    'hello-world': {
      library: 'HelloWorld',
      format: 'umd' as ModuleFormats,
      upstream: 'http://localhost:4000/hello-world/index.js',
    },
  },
  preload: ['hello-world'],
})

function MyApp({ Component, pageProps }: any) {
  return (
    <App injectHead={Head}>
      <Component {...pageProps} />
    </App>
  )
}

export default MyApp