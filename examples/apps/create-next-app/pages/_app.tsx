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
  // Link only run on development mode
  linked: {
    port: 4000,
  },
  vendors: {
    'react': React,
    'react-dom': ReactDOM,
  },
  // Declared modules in production
  modules: {
    'hello-world': {
      library: 'HelloWorld',
      format: 'umd' as ModuleFormats,
      upstream: 'https://hello-world.nuz.now.sh',
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
